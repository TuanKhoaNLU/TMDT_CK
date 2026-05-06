const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchProducts() {
  return getJson("/api/products");
}

export async function fetchOrders() {
  return getJson("/api/orders");
}
