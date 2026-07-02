import { useEffect, useState } from 'react'
import { api } from '../api'

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SlotsView() {
  const [slots, setSlots] = useState([])
  const [customers, setCustomers] = useState([])
  const [newSlotNumber, setNewSlotNumber] = useState('')
  const [parkingSlotId, setParkingSlotId] = useState(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [vehicleOverride, setVehicleOverride] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    Promise.all([api.getSlots(), api.getCustomers()])
      .then(([slotData, customerData]) => {
        setSlots(slotData)
        setCustomers(customerData)
      })
      .catch(() => setError('Could not reach the backend. Is it running on port 8080?'))
  }

  useEffect(() => {
    load()
  }, [])

  const addSlot = (e) => {
    e.preventDefault()
    if (!newSlotNumber.trim()) return
    api
      .addSlot(newSlotNumber.trim())
      .then(() => {
        setNewSlotNumber('')
        load()
      })
      .catch((err) => setError(err.message))
  }

  const openParkForm = (slotId) => {
    setParkingSlotId(slotId)
    setSelectedCustomerId('')
    setVehicleOverride('')
  }

  const confirmParking = (slotId) => {
    if (!selectedCustomerId) return
    const customer = customers.find((c) => c.id === Number(selectedCustomerId))
    const vehicleNumber = vehicleOverride.trim() || customer?.vehicleNumber || ''
    api
      .checkIn(slotId, selectedCustomerId, vehicleNumber)
      .then(() => {
        setParkingSlotId(null)
        load()
      })
      .catch((err) => setError(err.message))
  }

  const checkOut = (slotId) => {
    api
      .checkOut(slotId)
      .then((result) => {
        setMessage(
          `${result.customerName} (${result.vehicleNumber}) checked out of ${result.slotNumber} — ` +
            `${result.durationHours} hr(s), fee ₹${result.fee.toFixed(2)}`,
        )
        load()
      })
      .catch((err) => setError(err.message))
  }

  const deleteSlot = (id) => {
    api
      .deleteSlot(id)
      .then(load)
      .catch((err) => setError(err.message))
  }

  const available = slots.filter((s) => s.status === 'AVAILABLE').length
  const occupied = slots.length - available

  return (
    <div>
      <div className="summary">
        <span className="pill available">Available: {available}</span>
        <span className="pill occupied">Occupied: {occupied}</span>
        <span className="pill total">Total: {slots.length}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {message && (
        <div className="success-banner">
          {message}
          <button className="dismiss-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <form className="add-slot-form" onSubmit={addSlot}>
        <input
          type="text"
          placeholder="New slot number (e.g. A1)"
          value={newSlotNumber}
          onChange={(e) => setNewSlotNumber(e.target.value)}
        />
        <button type="submit">Add Slot</button>
      </form>

      <div className="slot-grid">
        {slots.map((slot) => (
          <div key={slot.id} className={`slot-card ${slot.status.toLowerCase()}`}>
            <div className="slot-card-header">
              <h2>{slot.slotNumber}</h2>
              <span className="status-badge">{slot.status}</span>
            </div>

            {slot.status === 'OCCUPIED' ? (
              <div className="slot-body">
                <p>Customer: <strong>{slot.customerName}</strong></p>
                <p>Vehicle: <strong>{slot.vehicleNumber}</strong></p>
                <p className="muted">Since {formatTime(slot.entryTime)}</p>
                <button className="checkout-btn" onClick={() => checkOut(slot.id)}>
                  Check Out
                </button>
              </div>
            ) : parkingSlotId === slot.id ? (
              <div className="slot-body">
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">Select customer…</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.vehicleNumber})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Vehicle number (optional override)"
                  value={vehicleOverride}
                  onChange={(e) => setVehicleOverride(e.target.value)}
                />
                <div className="btn-row">
                  <button className="checkin-btn" onClick={() => confirmParking(slot.id)}>
                    Confirm
                  </button>
                  <button className="cancel-btn" onClick={() => setParkingSlotId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="slot-body">
                <button className="checkin-btn" onClick={() => openParkForm(slot.id)}>
                  Park Vehicle
                </button>
              </div>
            )}

            {slot.status === 'AVAILABLE' && (
              <button className="delete-btn" onClick={() => deleteSlot(slot.id)}>
                Remove Slot
              </button>
            )}
          </div>
        ))}
      </div>

      {slots.length === 0 && !error && (
        <p className="empty-state">No parking slots yet. Add one above to get started.</p>
      )}
      {customers.length === 0 && slots.length > 0 && (
        <p className="empty-state">Add a customer in the Customers tab before parking a vehicle.</p>
      )}
    </div>
  )
}

export default SlotsView
