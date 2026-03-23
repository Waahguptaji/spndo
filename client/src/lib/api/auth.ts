import apiFetch from "../apiClient";

export type RegisterInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
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

export type LoginInput = {
  email : string;
  password : string;
}
export type LoginResponse = {
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

  
}


export const registerUser = async (data: RegisterInput): Promise<RegisterResponse> => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: data,
  });
};



export const login = async (data: LoginInput): Promise<LoginResponse> => {
    return apiFetch("/auth/login", {
        method: "POST",
        body: data
    })
}
export function getGoals(){
    return apiFetch("/goals");
}
export function getUserProfile(){
    return apiFetch("/user/me",{
        method: "GET"
    });
}

export function updateUserProfile(data: JSON){
    return apiFetch("/user/me",{
        method:"PATCH",
        body:data
    })
}