import { useEffect, useState } from 'react'
import { api } from '../api'
import StatCard from './StatCard'
import { SlotIcon, CheckCircleIcon, CarIcon, WalletIcon, ArrowRightIcon, ClockIcon } from './Icons'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function DashboardView({ setTab }) {
  const [slots, setSlots] = useState([])
  const [customers, setCustomers] = useState([])
  const [revenue, setRevenue] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = () => {
    Promise.all([api.getSlots(), api.getCustomers(), api.getRevenue(), api.getHistory()])
      .then(([slotData, customerData, revenueData, historyData]) => {
        setSlots(slotData)
        setCustomers(customerData)
        setRevenue(revenueData)
        setHistory(historyData)
      })
      .catch(() => setError('Could not reach the backend. Is it running on port 8080?'))
  }

  useEffect(() => {
    load()
  }, [])

  const available = slots.filter((s) => s.status === 'AVAILABLE')
  const occupiedCount = slots.length - available.length
  const todayRevenue = revenue?.byDate.find((d) => d.date === todayStr())?.revenue ?? 0
  const sparkData = revenue
    ? [...revenue.byDate].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-7).map((d) => d.revenue)
    : []

  const quickPark = () => {
    if (!selectedSlotId || !selectedCustomerId) return
    api
      .checkIn(selectedSlotId, selectedCustomerId)
      .then(() => {
        setNotice('Vehicle parked successfully.')
        setSelectedSlotId('')
        setSelectedCustomerId('')
        load()
      })
      .catch((err) => setError(err.message))
  }

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}
      {notice && (
        <div className="success-banner">
          {notice}
          <button className="dismiss-btn" onClick={() => setNotice('')}>×</button>
        </div>
      )}

      <div className="hero">
        <div className="hero-text">
          <h1>Park Easy.<br />Drive Happy.</h1>
          <p>Find and book secure parking spots anytime, anywhere.</p>
          <button className="hero-btn" onClick={() => setTab('slots')}>
            Find Parking <ArrowRightIcon width={16} height={16} />
          </button>
          {/* <div className="hero-steps">
            <span><SlotIcon width={14} height={14} /> Search Location</span>
            <span className="sep">›</span>
            <span><CarIcon width={14} height={14} /> Choose Spot</span>
            <span className="sep">›</span>
            <span><CheckCircleIcon width={14} height={14} /> Book &amp; Park</span>
          </div> */}
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          icon={<SlotIcon />}
          label="Total Slots"
          value={slots.length}
          sublabel="Configured"
          accent="#2563EB"
        />
        <StatCard
          icon={<CheckCircleIcon />}
          label="Available Now"
          value={available.length}
          sublabel="Ready to park"
          accent="#16A34A"
        />
        <StatCard
          icon={<CarIcon />}
          label="Occupied Now"
          value={occupiedCount}
          sublabel="Currently parked"
          accent="#DC2626"
        />
        <StatCard
          icon={<WalletIcon />}
          label="Today's Revenue"
          value={`₹${todayRevenue.toFixed(0)}`}
          sparkData={sparkData}
          accent="#7C3AED"
        />
      </div>

      <div className="dashboard-cols">
        <section className="panel">
          <div className="panel-header">
            <h2>Recent Sessions</h2>
            <button className="link-btn" onClick={() => setTab('reports')}>
              View All <ArrowRightIcon width={14} height={14} />
            </button>
          </div>
          {history.slice(0, 5).map((h) => (
            <div key={h.sessionId} className="session-row">
              <div className="session-icon">
                <CarIcon width={18} height={18} />
              </div>
              <div className="session-info">
                <p className="session-title">{h.customerName} · {h.vehicleNumber}</p>
                <p className="session-sub">
                  <ClockIcon width={12} height={12} /> {h.slotNumber} · {formatTime(h.entryTime)}
                </p>
              </div>
              <span className={`status-badge ${h.status.toLowerCase()}`}>{h.status}</span>
            </div>
          ))}
          {history.length === 0 && <p className="empty-state">No sessions yet.</p>}
        </section>

        <section className="panel quick-park">
          <div className="panel-header">
            <h2>Quick Park</h2>
          </div>
          <label>
            Slot
            <select value={selectedSlotId} onChange={(e) => setSelectedSlotId(e.target.value)}>
              <option value="">Select available slot…</option>
              {available.map((s) => (
                <option key={s.id} value={s.id}>{s.slotNumber}</option>
              ))}
            </select>
          </label>
          <label>
            Customer
            <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.vehicleNumber})</option>
              ))}
            </select>
          </label>
          <button className="hero-btn full" onClick={quickPark}>
            Park Vehicle
          </button>
          {(available.length === 0 || customers.length === 0) && (
            <p className="hint">
              {available.length === 0 ? 'No available slots.' : 'Add a customer first.'}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardView
