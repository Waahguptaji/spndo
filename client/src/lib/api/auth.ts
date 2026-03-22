import apiFetch from "../apiClient";

type RegisterInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    phone: string | null;
    profile_data: JSON | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
};

const registerUser = async (data: RegisterInput): Promise<RegisterResponse> => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: data,
  });
};

export { registerUser, logoutUser, isLoggedIn };
