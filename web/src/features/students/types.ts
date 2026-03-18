export type TermFeeItem = {
  amount: number;
  paidAmount: number;
  penaltyAmount: number;
  paymentStatus: string;
};

/** Term fees keyed by term name e.g. "1st Term Fee" -> { amount, paymentStatus } */
export type StudentFeeRow = {
  id: string;
  _id: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  admissionNumber: string;
  phone: string;
  email: string;
  amount: string;
  status: "Paid" | "Pending";
  /** Term-wise fee: "1st Term Fee" -> { amount, paymentStatus } */
  termFees: Record<string, TermFeeItem>;
};

/** API response shape: results array replaces table rows */
export type GetStudentsDetailsResponse = { results: StudentFeeRow[] };
