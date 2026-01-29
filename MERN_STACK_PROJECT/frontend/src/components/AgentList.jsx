import { useState, forwardRef, useImperativeHandle } from "react";
import "../styles/components.css";
import api from "../api/axios";

const AgentList = forwardRef((props, ref) => {
  const { agents, onAgentDeleted, onAgentUpdated } = props;
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [distributionModal, setDistributionModal] = useState(null);

  const openDistributionModal = (agent) => {
    setDistributionModal(agent);
  };

  const closeDistributionModal = () => {
    setDistributionModal(null);
  };

  useImperativeHandle(ref, () => ({
    // No longer needed since state is managed in parent
  }));

  const deleteAgent = async (agentId, agentName) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete agent "${agentName}"?\n\nThis action cannot be undone and will remove all assigned tasks.`)) {
      return;
    }

    try {
      await api.delete(`/agents/${agentId}`);
      onAgentDeleted();
      alert(`✅ Agent "${agentName}" deleted successfully!`);
    } catch (error) {
      console.error('Delete agent error:', error);
      alert('❌ Failed to delete agent. Please try again.');
    }
  };

  const startEdit = (agent) => {
    setEditingAgent(agent._id);
    setEditForm({ name: agent.name, email: agent.email, phone: agent.phone });
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingAgent(null);
    setEditForm({ name: "", email: "", phone: "" });
    setEditError("");
  };

  const saveEdit = async (agentId) => {
    setEditLoading(true);
    setEditError("");

    try {
      // Validate input
      if (!editForm.name || !editForm.email || !editForm.phone) {
        setEditError("⚠️ All fields are required!");
        setEditLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        setEditError("⚠️ Please enter a valid email address!");
        setEditLoading(false);
        return;
      }

      // Validate phone format
      if (editForm.phone.length < 10) {
        setEditError("⚠️ Phone number must be at least 10 digits!");
        setEditLoading(false);
        return;
      }

      // Make API call to update agent
      await api.put(`/agents/${agentId}`, editForm);

      // Update the agent using the callback
      onAgentUpdated();

      setEditingAgent(null);
      setEditForm({ name: "", email: "", phone: "" });
      alert(`✅ Agent "${editForm.name}" updated successfully!`);
    } catch (err) {
      setEditError("❌ Failed to update agent. Please try again.");
      console.error("Update agent error:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const toggleAgent = (agentId) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  return (
    <div className="component-box">
      <h2>Agents & Distributed Lists</h2>
      
      {agents.length === 0 ? (
        <p className="no-data">No agents found. Please add agents first.</p>
      ) : (
        <div className="agents-list">
          {agents.map((agent) => (
            <div key={agent._id} className="agent-card">
              <div className="agent-header">
                {editingAgent === agent._id ? (
                  <div className="edit-form">
                    {editError && <div className="error-message">{editError}</div>}
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Enter agent name"
                        disabled={editLoading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        placeholder="Enter agent email"
                        disabled={editLoading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone:</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        placeholder="Enter phone number"
                        disabled={editLoading}
                      />
                    </div>
                    <div className="edit-actions">
                      <button 
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                        disabled={editLoading}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => saveEdit(agent._id)}
                        disabled={editLoading}
                      >
                        {editLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      className="agent-info"
                      onClick={() => toggleAgent(agent._id)}
                    >
                      <h3>{agent.name}</h3>
                      <p className="agent-email">{agent.email}</p>
                      <p className="agent-phone">{agent.phone}</p>
                    </div>
                    <div className="agent-actions">
                      <div 
                        className="task-badge clickable"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDistributionModal(agent);
                        }}
                        title="Click to view distribution details"
                      >
                        <span>{agent.tasks.length}</span>
                        <span className="badge-label">tasks</span>
                      </div>
                      <button 
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(agent);
                        }}
                        title="Edit agent"
                      >
                        ✏️ Edit
                      </button>
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
                  </>
                )}
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
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agent.tasks.map((task, idx) => (
                          <tr key={idx}>
                            <td>{task.firstName}</td>
                            <td>{task.phone}</td>
                            <td>{task.notes || "-"}</td>
                            <td>
                              <span className="task-contact">
                                📞 {task.phone}
                              </span>
                            </td>
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

      {/* Distribution Details Modal */}
      {distributionModal && (
        <div className="modal-overlay" onClick={closeDistributionModal}>
          <div className="modal-content distribution-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Distribution Details - {distributionModal.name}</h3>
              <button className="modal-close" onClick={closeDistributionModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="distribution-summary">
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Tasks Assigned:</span>
                    <span className="stat-value">{distributionModal.tasks.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Agent Email:</span>
                    <span className="stat-value">{distributionModal.email}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Agent Phone:</span>
                    <div className="stat-value phone-with-call">
                      <span>{distributionModal.phone}</span>
                      <button 
                        className="btn-call-modal"
                        onClick={() => window.location.href = `tel:${distributionModal.phone}`}
                        title="Call agent"
                      >
                        📞
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="tasks-preview">
                  <h4>All Assigned Tasks ({distributionModal.tasks.length})</h4>
                  {distributionModal.tasks.length > 0 ? (
                    <div className="tasks-list">
                      {distributionModal.tasks.map((task, idx) => (
                        <div key={idx} className="task-item">
                          <div className="task-info">
                            <span className="task-name">{task.firstName}</span>
                            <span className="task-phone">{task.phone}</span>
                            {task.notes && <span className="task-notes">{task.notes}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-tasks-modal">No tasks assigned yet</p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeDistributionModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});

export default AgentList;
