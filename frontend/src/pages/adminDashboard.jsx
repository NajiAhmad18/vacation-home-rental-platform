import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar'
import Header from '../components/AdminHeader'
import ContentArea from '../components/admin/ContentArea'
import { useAuthStore } from '../stores/useAuthStore.js';

const AdminDashboard = () => {
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
          <ContentArea activeSection={activeSection} />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard;