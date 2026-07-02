import Sparkline from './Sparkline'

function StatCard({ icon, label, value, sublabel, accent, sparkData }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${accent}1a`, color: accent }}>
        {icon}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-footer">
        {sublabel && <span className="stat-sublabel">{sublabel}</span>}
        {sparkData && <Sparkline data={sparkData} color={accent} width={80} height={28} />}
      </div>
    </div>
  )
}

export default StatCard
