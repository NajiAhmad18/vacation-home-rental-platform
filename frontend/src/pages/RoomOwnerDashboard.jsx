import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/roomOwner/Sidebar';
import ContentArea from '../components/roomOwner/ContentArea';
import Header from '../components/AdminHeader';
import { useAuthStore } from '../stores/useAuthStore.js';

const RoomOwnerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/auth/sign-in');
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onSignOut={handleSignOut}
      />
      <div className="flex-1 flex flex-col ml-64">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-auto">
          <ContentArea
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </main>
      </div>
    </div>
  )
}

export default RoomOwnerDashboard;