import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import RateSetting from './components/RateSetting'
import DashboardView from './components/DashboardView'
import SlotsView from './components/SlotsView'
import CustomersView from './components/CustomersView'
import ReportsView from './components/ReportsView'

const TITLES = {
  dashboard: 'Dashboard',
  slots: 'Slots',
  customers: 'Customers',
  reports: 'Reports',
}

function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="layout">
      <Sidebar tab={tab} setTab={setTab} />

      <div className="main">
        <div className="topbar">
          <h2>{TITLES[tab]}</h2>
          <RateSetting />
        </div>

        <main>
          {tab === 'dashboard' && <DashboardView setTab={setTab} />}
          {tab === 'slots' && <SlotsView />}
          {tab === 'customers' && <CustomersView />}
          {tab === 'reports' && <ReportsView />}
        </main>
      </div>
    </div>
  )
}

export default App
