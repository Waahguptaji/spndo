import apiFetch from "../apiClient";

export type Budget = {
  id: string;
  amount: number;
  month: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateBudgetInput = {
  amount: number;
  categoryId: string;
};

const getCurrentMonth = () => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
};

export const getBudgets = async (
  month = getCurrentMonth(),
): Promise<Budget[]> => {
  return apiFetch(`/budgets/${month}`);
};

export const updateBudgets = async (
  budgets: UpdateBudgetInput[],
  month = getCurrentMonth(),
): Promise<Budget[]> => {
  return apiFetch(`/budgets/${month}`, {
    method: "PUT",
    body: budgets,
  });
};
