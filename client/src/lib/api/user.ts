import apiFetch from "../apiClient";

export type UserProfileData = {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  image?: string;
};

export type MeResponse = {
  id: string;
  email: string;
  phone: string | null;
  profile_data: UserProfileData | null;
};

export type UpdateMeInput = {
  email?: string;
  phone?: string;
  profile_data?: UserProfileData;
};

export const getMe = async (): Promise<MeResponse> => {
  return apiFetch("/user/me");
};

export const updateMe = async (data: UpdateMeInput) => {
  return apiFetch("/user/me", {
    method: "PATCH",
    body: data,
  });
};
