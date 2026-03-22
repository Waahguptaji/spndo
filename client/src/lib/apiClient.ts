const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

export default async function apiFetch(
  endpoint: string,
  options: ApiOptions = {},
) {
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
    console.log("API Response:", {
      data,
    });

    // Handle errors
    // Handle errors
    if (!res.ok) {
      let errorMsg = "Something went wrong";
      // Check for validation details first
      if (
        data?.details &&
        Array.isArray(data.details) &&
        data.details.length > 0
      ) {
        errorMsg = data.details[0].message;
      } else if (data?.error) {
        errorMsg = data.error;
      }

      throw new Error(errorMsg);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error; // Re-throw with its message
    }
    throw new Error("Network error");
  }
}
