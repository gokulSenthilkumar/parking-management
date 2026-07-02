import CarIllustration from './CarIllustration'
import { DashboardIcon, SlotIcon, CustomersIcon, ReportsIcon } from './Icons'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { key: 'slots', label: 'Slots', Icon: SlotIcon },
  { key: 'customers', label: 'Customers', Icon: CustomersIcon },
  { key: 'reports', label: 'Reports', Icon: ReportsIcon },
]

function Sidebar({ tab, setTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-badge">P</span>
        <div>
          <h1>ParkNest</h1>
          <p>Private Parking</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`sidebar-nav-item ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-promo">
        <p className="promo-title">Park Smarter.<br />Earn More.</p>
        <p className="promo-text">Track every slot, customer and rupee in one place.</p>
        <CarIllustration width={120} />
      </div>

      <div className="sidebar-profile">
        <span className="avatar">A</span>
        <div>
          <p className="profile-name">Admin</p>
          <p className="profile-role">ParkNest Operator</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
