import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to extract PDF data
  app.post("/api/extract-pdf", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Uploaded file must be a PDF" });
      }

      const prompt = `
      Please extract the following financial data from the provided annual report PDF for a bank.
      Return the data strictly in JSON format as an array of objects (if there's comparison data for multiple years, return all years possible, but definitely the current year).
      For the Bank Code, use the 4-letter stock ticker (e.g. BBCA, BBRI) if you can deduce it, otherwise just abbreviate the bank's name.
      Use exactly these keys:
      - year (number): e.g. 2022
      - bankCode (string): e.g. BBCA
      - totalKredit (number): Total Kredit / Pinjaman yang diberikan (Gross). Convert everything to millions (Jutaan Rupiah) if it's not already. For example, if it says 596,109,815 in millions, output 596109815.
      - totalCKPN (number): Cadangan Kerugian Penurunan Nilai pada pinjaman yang diberikan. Note: sometimes it's presented as negative, output it as a positive number.
      - totalAset (number): Total Aset / Jumlah Aset.
      - modalSendiri (number): Ekuitas yang dapat diatribusikan kepada pemilik entitas induk / Total Ekuitas.
      - atmr (number): Aset Tertimbang Menurut Risiko (Risk Weighted Assets). Note: this might not be easily found, if you cannot find it, estimate it by roughly totalAset * 0.7 or just return 0 if absolutely not found.
      - labaBersih (number): Laba bersih tahun berjalan / Jumlah laba rugi.
      - arusKasOperasi (number): Jumlah arus kas bersih yang diperoleh dari aktivitas operasi.
      - npl (number): NPL Gross percentage (e.g. 1.71).

      Example output:
      [
        {
          "year": 2022,
          "bankCode": "BBCA",
          "totalKredit": 596109815,
          "totalCKPN": 33947518,
          "totalAset": 1314731674,
          "modalSendiri": 221018606,
          "atmr": 820000000,
          "labaBersih": 40735722,
          "arusKasOperasi": 33779263,
          "npl": 1.71
        }
      ]
      `;

      let response;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                inlineData: {
                  data: req.file.buffer.toString("base64"),
                  mimeType: "application/pdf",
                },
              },
              prompt,
            ],
            config: {
              responseMimeType: "application/json",
            },
          });
          break; // if successful, break the retry loop
        } catch (e: any) {
          console.error(`Attempt failed (${3 - retries + 1}/3):`, e.message);
          
          if (e.message && e.message.includes("429")) {
            throw new Error("Quota API Gemini (Free Tier) sedang habis. Silakan coba beberapa saat lagi.");
          }
          if (e.message && e.message.includes("token count exceeds")) {
            throw new Error("Dokumen terlalu besar, melebihi batas maksimal yang dapat diproses oleh AI. Coba gunakan PDF dengan ukuran lebih kecil.");
          }
          
          retries--;
          if (retries === 0) throw e;
          // Wait 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!response || !response.text) {
        throw new Error("Empty response from AI");
      }
      
      const parsedData = JSON.parse(response.text);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Error extracting PDF:", error);
      res.status(500).json({ error: error.message || "Failed to extract PDF" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support express 4.x and 5.x routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
