import apiFetch from "../apiClient";

export type MonthlySummary = {
  income: number;
  expense: number;
  net: number;
  byCategory: Array<{
    category: string;
    amount: number;
  }>;
};

const currentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}`;
};

export const getMonthlySummary = async (
  month = currentMonthValue(),
): Promise<MonthlySummary> => {
  return apiFetch(`/summary/monthly?month=${encodeURIComponent(month)}`);
};
