import { Sidebar } from './Sidebar.jsx';
import { Navbar } from './Navbar.jsx';
import '../../../styles/App.css';

export const DashboardContainer = ({ children }) => {
  return (
    <div className='dashboard-layout'>
      <Sidebar />

      <div className='dashboard-main'>
        <Navbar />

        <main className='dashboard-content'>{children}</main>
      </div>
    </div>
  );
};
