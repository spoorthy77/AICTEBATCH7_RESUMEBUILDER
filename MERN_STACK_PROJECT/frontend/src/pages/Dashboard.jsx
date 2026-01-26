import { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import AddAgent from "../components/AddAgent";
import UploadFile from "../components/UploadFile";
import AgentList from "../components/AgentList";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const agentsRef = useRef(null);
  const uploadRef = useRef(null);
  const viewTasksRef = useRef(null);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>MERN Stack Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Dashboard Overview Section */}
        <div className="dashboard-overview">
          <div className="welcome-section">
            <h2>Welcome to Admin Dashboard</h2>
            <p>Manage agents, upload task lists, and distribute work efficiently</p>
          </div>
          
          <div className="quick-stats">
            <div className="stat-card clickable" onClick={() => scrollToSection(agentsRef)}>
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Agents</h3>
                <p>Create and manage agents</p>
              </div>
            </div>
            
            <div className="stat-card clickable" onClick={() => scrollToSection(uploadRef)}>
              <div className="stat-icon">📁</div>
              <div className="stat-info">
                <h3>Upload Files</h3>
                <p>CSV/Excel task distribution</p>
              </div>
            </div>
            
            <div className="stat-card clickable" onClick={() => scrollToSection(viewTasksRef)}>
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>View Tasks</h3>
                <p>Monitor distributed tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent List Section - Show First */}
        <div className="dashboard-section" ref={viewTasksRef}>
          <AgentList />
        </div>

        {/* Add Agent Section */}
        <div className="dashboard-section" ref={agentsRef}>
          <AddAgent />
        </div>

        {/* Upload File Section */}
        <div className="dashboard-section" ref={uploadRef}>
          <UploadFile />
        </div>
      </main>
    </div>
  );
}
