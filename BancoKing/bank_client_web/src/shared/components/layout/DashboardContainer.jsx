import { Sidebar } from './Sidebar.jsx';
import '../../../styles/App.css';

export const DashboardContainer = ({ children }) => {
  return (
    <div className='dashboard-layout'>
      <Sidebar />

      <main className='dashboard-content'>{children}</main>
    </div>
  );
};
