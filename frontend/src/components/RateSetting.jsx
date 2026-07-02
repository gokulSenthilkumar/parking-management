import { useEffect, useState } from 'react'
import { api } from '../api'

function RateSetting() {
  const [rate, setRate] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    api.getSettings().then((s) => setRate(s.ratePerHourInr))
  }, [])

  const save = () => {
    const value = parseFloat(draft)
    if (Number.isNaN(value) || value <= 0) return
    api.updateSettings(value).then((s) => {
      setRate(s.ratePerHourInr)
      setEditing(false)
    })
  }

  if (rate === null) return null

  return (
    <div className="rate-setting">
      {editing ? (
        <>
          <input
            type="number"
            min="1"
            step="1"
            autoFocus
            defaultValue={rate}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <button onClick={save}>Save</button>
          <button className="cancel-btn" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <button className="rate-pill" onClick={() => setEditing(true)}>
          Rate: ₹{rate}/hr ✎
        </button>
      )}
    </div>
  )
}

export default RateSetting
