const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

export async function apiFetch(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", body, headers = {} } = options;

  // Get token from localStorage
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    // Parse response safely
    const data = await res.json().catch(() => ({}));

    // Handle errors
    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error");
  }
}
