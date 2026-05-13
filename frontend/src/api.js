const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API ${options.method ?? "GET"} ${path} failed: ${response.status}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const fetchProducts = () => request("/api/products");
export const fetchOrders = () => request("/api/orders");

export const fetchSellerProfile = (shopId) => request(`/api/seller/${shopId}/profile`);
export const updateSellerProfile = (shopId, body) =>
  request(`/api/seller/${shopId}/profile`, { method: "PUT", body: JSON.stringify(body) });

export const fetchSellerDashboard = (shopId) => request(`/api/seller/${shopId}/dashboard`);
export const fetchSellerProducts = (shopId) => request(`/api/seller/${shopId}/products`);
export const createSellerProduct = (shopId, body) =>
  request(`/api/seller/${shopId}/products`, { method: "POST", body: JSON.stringify(body) });
export const updateSellerProduct = (shopId, productId, body) =>
  request(`/api/seller/${shopId}/products/${productId}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteSellerProduct = (shopId, productId) =>
  request(`/api/seller/${shopId}/products/${productId}`, { method: "DELETE" });

export const fetchSellerOrders = (shopId) => request(`/api/seller/${shopId}/orders`);
export const updateOrderStatus = (shopId, orderId, status) =>
  request(`/api/seller/${shopId}/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const fetchSellerCustomRequests = (shopId) =>
  request(`/api/seller/${shopId}/custom-requests`);
export const sellerCreateQuote = (shopId, requestId, body) =>
  request(`/api/seller/${shopId}/custom-requests/${requestId}/quotes`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const fetchCustomRequests = (params = {}) => {
  const search = new URLSearchParams(params).toString();
  return request(`/api/custom-requests${search ? `?${search}` : ""}`);
};
export const fetchCustomRequestDetail = (id) => request(`/api/custom-requests/${id}`);
export const fetchCustomRequestQuotes = (id) => request(`/api/custom-requests/${id}/quotes`);
export const createCustomRequest = (body) =>
  request(`/api/custom-requests`, { method: "POST", body: JSON.stringify(body) });
export const acceptQuote = (requestId, quoteId) =>
  request(`/api/custom-requests/${requestId}/accept-quote/${quoteId}`, { method: "POST" });
export const rejectCustomRequest = (id) =>
  request(`/api/custom-requests/${id}/reject`, { method: "POST" });
export const markRequestInProgress = (id) =>
  request(`/api/custom-requests/${id}/progress`, { method: "POST" });
export const markRequestComplete = (id) =>
  request(`/api/custom-requests/${id}/complete`, { method: "POST" });

export const registerShop = (body) =>
  request("/api/shops/register", { method: "POST", body: JSON.stringify(body) });

export const fetchAdminDashboard = () => request("/api/admin/dashboard");
export const fetchAdminUsers = () => request("/api/admin/users");
export const fetchAdminShops = () => request("/api/admin/shops");
export const fetchAdminProducts = () => request("/api/admin/products");
export const updateAdminProductStatus = (id, status) =>
  request(`/api/admin/products/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
