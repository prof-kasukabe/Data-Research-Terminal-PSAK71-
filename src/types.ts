export interface RawBankData {
  id: string;
  bankCode: string;
  year: number;
  totalKredit: number;
  totalCKPN: number;
  totalAset: number;
  modalSendiri: number;
  atmr: number;
  labaBersih: number;
  arusKasOperasi: number;
  npl: number;
}

export interface CalculatedData extends RawBankData {
  psak71: number; // Total CKPN / Total Kredit
  size: number; // LN(Total Aset)
  car: number; // Modal Sendiri / ATMR
  totalAkrual: number; // Laba Bersih - Arus Kas Operasi
}
