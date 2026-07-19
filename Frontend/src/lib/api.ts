const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

function getAuthHeaders(extraHeaders: HeadersInit = {}): HeadersInit {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders || {}),
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...getAuthHeaders(options.headers),
      },
      ...options,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();
    const payload = contentType.includes("application/json")
      ? text
        ? JSON.parse(text)
        : null
      : text;

    if (!response.ok) {
      let message = `${response.status} ${response.statusText || "Request failed"}`;

      if (payload && typeof payload === "object") {
        if ("detail" in payload) {
          message = String((payload as { detail?: unknown }).detail);
        } else if ("message" in payload) {
          message = String((payload as { message?: unknown }).message);
        } else {
          const entries = Object.entries(payload as Record<string, unknown>);
          if (entries.length > 0) {
            message = entries
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return `${key}: ${value.join(" ")}`;
                }
                return `${key}: ${String(value)}`;
              })
              .join(" | ");
          }
        }
      } else if (typeof payload === "string" && payload.trim()) {
        message = payload;
      }

      throw new Error(message);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error("API request failed");
  }
}

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  role: "farmer" | "buyer";
  phone?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  return request<{ user: unknown; detail: string }>('/api/auth/register/', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  return request<{ access: string; refresh: string; user: unknown }>('/api/auth/login/', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function sendChatMessage(message: string) {
  return request<{ id: number; title: string; messages: Array<{ sender: string; message: string }> }>('/api/ai/chatbot/message/', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
