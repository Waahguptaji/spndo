const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  retry?: boolean;
};

function clearAuthStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

async function handleAuthFailure() {
  clearAuthStorage();
  window.location.href = "/login";
  throw new Error("Session expired. Please log in again.");
}

async function refreshAccessToken() {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  const data: { accessToken?: string } = await res.json();
  if (!data.accessToken) return null;

  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

export default async function apiFetch(
  endpoint: string,
  options: ApiOptions = {},
) {
  const { method = "GET", body, headers = {}, retry = true } = options;

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const sendRequest = async (token: string | null) => {
    return fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  };

  try {
    let res = await sendRequest(accessToken);

    if (res.status === 401 && retry) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        res = await sendRequest(newAccessToken);
      } else {
        await handleAuthFailure();
      }
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      let errorMsg = "Something went wrong";

      if (
        data?.details &&
        Array.isArray(data.details) &&
        data.details.length > 0
      ) {
        errorMsg = data.details[0].message;
      } else if (data?.error) {
        errorMsg = data.error;
      } else if (data?.message) {
        errorMsg = data.message;
      }

      throw new Error(errorMsg);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Network error");
  }
}

export async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  clearAuthStorage();
  window.location.href = "/login";
}
