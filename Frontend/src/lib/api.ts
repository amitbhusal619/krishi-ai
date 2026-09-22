const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

function getStoredToken() {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem("accessToken");
  return token && token.trim() ? token.trim() : null;
}

function getAuthHeaders(extraHeaders: HeadersInit = {}): HeadersInit {
  const token = getStoredToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders || {}),
  };
}

async function refreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refresh = window.localStorage.getItem("refreshToken");
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await res.json();
    if (data && data.access) {
      window.localStorage.setItem("accessToken", data.access);
      return data.access;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear tokens and redirect
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  return null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    let response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...getAuthHeaders(options.headers),
      },
      ...options,
    });

    if (
      response.status === 401 &&
      !path.includes("/login") &&
      !path.includes("/refresh") &&
      !path.includes("/register")
    ) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        response = await fetch(`${API_BASE_URL}${path}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...getAuthHeaders(options.headers),
          },
          ...options,
        });
      }
    }

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

function normalizeListResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const results = (payload as { results?: unknown }).results;
    if (Array.isArray(results)) return results as T[];
  }

  return [];
}

async function requestList<T>(path: string): Promise<T[]> {
  const payload = await request<T[] | { results?: T[] }>(path, { method: "GET" });
  return normalizeListResponse<T>(payload);
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

export async function sendChatMessage(message: string, conversationId?: number) {
  return request<{ id: number; title: string; messages: Array<{ sender: string; message: string }> }>('/api/ai/chatbot/message/', {
    method: 'POST',
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversation: conversationId } : {}),
    }),
  });
}

export async function getAuthStatus() {
  return request<{ detail?: string; user?: unknown }>('/api/auth/me/', {
    method: 'GET',
  });
}

export type ChatMessage = {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  created_at: string;
};

export type ChatConversation = {
  id: number;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
};

export async function getChatConversations() {
  return requestList<ChatConversation>('/api/ai/chatbot/conversations/');
}

export type FarmerAnalytics = {
  total_products: number;
  active_products: number;
  orders_in_progress: number;
  total_orders: number;
  total_units_sold: number;
  total_revenue: number;
  average_rating: number | null;
  monthly_revenue: Array<{ month: string; revenue: number }>;
};

export type BuyerAnalytics = {
  active_orders: number;
  completed_orders: number;
  wishlist_items: number;
  cart_items: number;
};

export type AdminAnalytics = {
  total_users: number;
  total_farmers: number;
  total_buyers: number;
  total_products: number;
  pending_products: number;
  total_orders: number;
  total_revenue: number;
  orders_by_status: Record<string, number>;
  monthly_orders: Array<{ month: string; count: number; revenue: number }>;
};

export type ApiOrderItem = {
  id: number;
  product: number | null;
  farmer: number | null;
  product_name: string;
  unit_price: string | number;
  quantity: string | number;
  subtotal?: string | number;
};

export type ApiOrder = {
  id: number;
  buyer: number | { id: number; username: string; first_name?: string; last_name?: string };
  status: string;
  payment_status: string;
  shipping_address: string;
  shipping_city?: string;
  shipping_phone?: string;
  notes?: string;
  total_amount: string | number;
  created_at: string;
  items: ApiOrderItem[];
};

export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  farmer: number | { id: number; username: string; first_name?: string; last_name?: string };
  category: number | { id: number; name: string; slug: string };
  price: string | number;
  unit: string;
  quantity_available: string | number;
  is_organic: boolean;
  location: string;
  image?: string;
  status: string;
  description: string;
  created_at: string;
};

export type ApiWishlistItem = {
  id: number;
  product: ApiProduct;
  created_at: string;
};

export async function getFarmerAnalytics() {
  return request<FarmerAnalytics>('/api/analytics/farmer/', { method: 'GET' });
}

export async function getBuyerAnalytics() {
  return request<BuyerAnalytics>('/api/analytics/buyer/', { method: 'GET' });
}

export async function getAdminAnalytics() {
  return request<AdminAnalytics>('/api/analytics/admin/', { method: 'GET' });
}

export async function getOrders() {
  return requestList<ApiOrder>('/api/orders/orders/');
}

export async function getProducts(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return requestList<ApiProduct>(`/api/products/products/${query}`);
}

export async function getWishlist() {
  return requestList<ApiWishlistItem>('/api/orders/wishlist/');
}

export type ApiUser = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_verified?: boolean;
  date_joined?: string;
};

export async function getUsers(role?: string) {
  const query = role ? `?role=${role}` : '';
  return requestList<ApiUser>(`/api/auth/users/${query}`);
}


