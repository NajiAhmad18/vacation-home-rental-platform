import { useState } from 'react'
import Sidebar from '../components/admin/Sidebar'
import Header from '../components/AdminHeader'
import ContentArea from '../components/admin/ContentArea'

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col ml-64">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-auto">
          <ContentArea activeSection={activeSection} />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard