import { useState } from 'react'
import Sidebar from '../components/roomOwner/Sidebar';
import ContentArea from '../components/roomOwner/ContentArea';
import Header from '../components/AdminHeader';

const RoomOwnerDashboard = () => {
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

export default RoomOwnerDashboard