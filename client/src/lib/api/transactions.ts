import apiFetch from "../apiClient";

type TransactionCategory = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string;
  category: TransactionCategory | null;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  occurred_at: string;
  note?: string | null;
  metadata?: Record<string, unknown> | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateTransactionInput = {
  title: string;
  amount: number;
  occurred_at: string;
  category_id: string;
  type: "INCOME" | "EXPENSE";
  note?: string;
};

type GetTransactionsResponse = {
  transactions: Transaction[];
};

export const createTransaction = async (data: CreateTransactionInput) => {
  return apiFetch("/transactions", {
    method: "POST",
    body: data,
  });
};

export const getTransactions = async (): Promise<GetTransactionsResponse> => {
  return apiFetch("/transactions");
};

export const deleteTransaction = async (id: string) => {
  return apiFetch(`/transactions/${id}`, {
    method: "DELETE",
  });
};
