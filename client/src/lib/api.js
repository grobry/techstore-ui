async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null));
    return request(`/products${qs.toString() ? `?${qs}` : ''}`);
  },
  getCategories: () => request('/products/categories'),
  getProduct: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrder: (orderNumber, email) =>
    request(`/orders/${encodeURIComponent(orderNumber)}?email=${encodeURIComponent(email)}`),
};
