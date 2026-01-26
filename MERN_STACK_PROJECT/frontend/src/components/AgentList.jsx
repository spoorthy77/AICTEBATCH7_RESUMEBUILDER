import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/components.css";

export default function AgentList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedAgent, setExpandedAgent] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/agents");
      setAgents(response.data);
      setError("");
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError("❌ Cannot connect to server. Please check your connection.");
      } else if (err.response?.status === 401) {
        setError("❌ Session expired. Please login again.");
      } else {
        setError("❌ " + (err.response?.data?.message || "Failed to load agents. Please try again."));
      }
      console.error("Fetch agents error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (agentId, agentName) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete agent "${agentName}"?\n\nThis action cannot be undone and will remove all assigned tasks.`)) {
      return;
    }

    try {
      const response = await api.delete(`/agents/${agentId}`);
      setAgents(agents.filter(agent => agent._id !== agentId));
      alert(`✅ ${response.data.message}`);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        alert("❌ Cannot connect to server. Please check your connection.");
      } else {
        alert("❌ Failed to delete agent: " + (err.response?.data?.message || "Unknown error"));
      }
      console.error("Delete agent error:", err);
    }
  };

  const toggleAgent = (agentId) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  if (loading) {
    return (
      <div className="component-box">
        <h2>Agents & Distributed Lists</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="component-box">
      <h2>Agents & Distributed Lists</h2>
      
      {error && <div className="error-message">{error}</div>}

      {agents.length === 0 ? (
        <p className="no-data">No agents found. Please add agents first.</p>
      ) : (
        <div className="agents-list">
          {agents.map((agent) => (
            <div key={agent._id} className="agent-card">
              <div 
                className="agent-header"
                onClick={() => toggleAgent(agent._id)}
              >
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p className="agent-email">{agent.email}</p>
                  <p className="agent-mobile">{agent.mobile}</p>
                </div>
                <div className="agent-actions">
                  <div className="task-badge">
                    <span>{agent.tasks.length}</span>
                    <span className="badge-label">tasks</span>
                  </div>
                  <button 
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAgent(agent._id, agent.name);
                    }}
                    title="Delete agent"
                  >
                    🗑️ Delete
                  </button>
                  <span className="expand-icon">
                    {expandedAgent === agent._id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {expandedAgent === agent._id && (
                <div className="agent-tasks">
                  {agent.tasks.length === 0 ? (
                    <p className="no-tasks">No tasks assigned yet</p>
                  ) : (
                    <table className="tasks-table">
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Phone</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agent.tasks.map((task, idx) => (
                          <tr key={idx}>
                            <td>{task.firstName}</td>
                            <td>{task.phone}</td>
                            <td>{task.notes || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={fetchAgents} className="btn btn-secondary" style={{ marginTop: "20px" }}>
        Refresh
      </button>
    </div>
  );
}
