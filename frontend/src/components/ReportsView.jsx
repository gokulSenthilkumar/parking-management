import { useEffect, useState } from 'react'
import { api } from '../api'

function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ReportsView() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [revenue, setRevenue] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    Promise.all([api.getRevenue(from, to), api.getHistory(from, to)])
      .then(([revenueData, historyData]) => {
        setRevenue(revenueData)
        setHistory(historyData)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      <div className="filter-bar">
        <label>
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button onClick={load}>Apply</button>
      </div>

      <section className="report-section">
        <div className="report-header">
          <h2>Revenue Report</h2>
          <a className="export-btn" href={api.exportRevenueUrl(from, to)}>
            Export to Excel
          </a>
        </div>

        {revenue && (
          <>
            <div className="summary">
              <span className="pill total">Total Revenue: ₹{revenue.totalRevenue.toFixed(2)}</span>
              <span className="pill available">Sessions: {revenue.sessionCount}</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue (₹)</th>
                  <th>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {revenue.byDate.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>₹{d.revenue.toFixed(2)}</td>
                    <td>{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {revenue.byDate.length === 0 && <p className="empty-state">No revenue in this range.</p>}
          </>
        )}
      </section>

      <section className="report-section">
        <div className="report-header">
          <h2>Parking History</h2>
          <a className="export-btn" href={api.exportHistoryUrl(from, to)}>
            Export to Excel
          </a>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Duration</th>
              <th>Fee (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.sessionId}>
                <td>{h.slotNumber}</td>
                <td>{h.customerName}</td>
                <td>{h.vehicleNumber}</td>
                <td>{formatTime(h.entryTime)}</td>
                <td>{formatTime(h.exitTime)}</td>
                <td>{h.durationHours ? `${h.durationHours} hr` : '—'}</td>
                <td>{h.fee ? h.fee.toFixed(2) : '—'}</td>
                <td>
                  <span className={`status-badge ${h.status.toLowerCase()}`}>{h.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && <p className="empty-state">No parking history in this range.</p>}
      </section>
    </div>
  )
}

export default ReportsView
