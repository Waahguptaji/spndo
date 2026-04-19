import apiFetch from "../apiClient";

export type CategoryType = "INCOME" | "EXPENSE";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  userId: string;
  created_at: string;
};

type GetCategoriesResponse = {
  categories: Category[];
};

type CreateCategoryResponse = {
  message: string;
  category: Category;
};

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  return apiFetch("/categories");
};

export const createCategory = async (data: {
  name: string;
  type: CategoryType;
}): Promise<CreateCategoryResponse> => {
  return apiFetch("/categories", {
    method: "POST",
    body: data,
  });
};
