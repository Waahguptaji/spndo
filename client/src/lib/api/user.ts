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

export const updateMe = async (data: UpdateMeInput): Promise<MeResponse> => {
	return apiFetch("/user/me", {
		method: "PATCH",
		body: data,
	});
};

export const uploadProfileImage = async (
	file: File,
	profileData?: UserProfileData,
): Promise<MeResponse> => {
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	if (!API_URL) throw new Error("Missing NEXT_PUBLIC_API_URL");

	const token =
		typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

	const formData = new FormData();
	formData.append("image", file);
	if (profileData) {
		formData.append("profile_data", JSON.stringify(profileData));
	}

	const res = await fetch(`${API_URL}/user/me`, {
		method: "PATCH",
		headers: {
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: formData,
	});

	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(data?.error || data?.message || "Failed to upload image");
	}

	return data as MeResponse;
};
