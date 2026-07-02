export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getSlots: () => request('/slots'),
  addSlot: (slotNumber) =>
    request('/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotNumber }),
    }),
  deleteSlot: (id) => request(`/slots/${id}`, { method: 'DELETE' }),
  checkIn: (id, customerId, vehicleNumber) =>
    request(`/slots/${id}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: String(customerId), vehicleNumber }),
    }),
  checkOut: (id) => request(`/slots/${id}/checkout`, { method: 'POST' }),

  getCustomers: () => request('/customers'),
  addCustomer: (customer) =>
    request('/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  getSettings: () => request('/settings'),
  updateSettings: (ratePerHourInr) =>
    request('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ratePerHourInr }),
    }),

  getHistory: (from, to) => request(`/reports/history?${qs({ from, to })}`),
  getRevenue: (from, to) => request(`/reports/revenue?${qs({ from, to })}`),
  exportHistoryUrl: (from, to) => `${API_BASE}/reports/history/export?${qs({ from, to })}`,
  exportRevenueUrl: (from, to) => `${API_BASE}/reports/revenue/export?${qs({ from, to })}`,
}

function qs(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value)
  })
  return search.toString()
}
