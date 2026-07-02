import { useEffect, useState } from 'react'
import { api } from '../api'

const EMPTY_FORM = { name: '', phone: '', vehicleNumber: '', email: '' }

function CustomersView() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = () => {
    api.getCustomers().then(setCustomers).catch((err) => setError(err.message))
  }

  useEffect(() => {
    load()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.vehicleNumber.trim()) return
    api
      .addCustomer(form)
      .then(() => {
        setForm(EMPTY_FORM)
        load()
      })
      .catch((err) => setError(err.message))
  }

  const remove = (id) => {
    api
      .deleteCustomer(id)
      .then(load)
      .catch((err) => setError(err.message))
  }

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      <form className="customer-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Vehicle number"
          value={form.vehicleNumber}
          onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit">Add Customer</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Vehicle Number</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.vehicleNumber}</td>
              <td>{c.email || '—'}</td>
              <td>
                <button className="delete-btn small" onClick={() => remove(c.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && !error && (
        <p className="empty-state">No customers yet. Add one above.</p>
      )}
    </div>
  )
}

export default CustomersView
