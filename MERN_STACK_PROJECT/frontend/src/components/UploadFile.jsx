import { useState } from "react";
import api from "../api/axios";
import "../styles/components.css";

export default function UploadFile({ agents, onTasksDistributed }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [distributionDetails, setDistributionDetails] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['.csv', '.xls', '.xlsx'];
      const fileName = selectedFile.name.toLowerCase();
      const hasValidType = validTypes.some(type => fileName.endsWith(type));
      
      if (!hasValidType) {
        setError("⚠️ Invalid file type! Please select a CSV, XLS, or XLSX file only.");
        setFile(null);
        e.target.value = '';
        return;
      }
      
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
        setError(`⚠️ File too large (${sizeMB}MB)! Maximum size is 10MB.`);
        setFile(null);
        e.target.value = '';
        return;
      }
      
      setError("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (agents.length === 0) {
      setError("No agents available. Please add agents first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setDistributionDetails(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Send file to backend for processing and distribution
      const response = await api.post('/upload', formData);

      // Update success message and distribution details from backend response
      setSuccess(`✅ ${response.data.message}`);
      setDistributionDetails({
        distributions: response.data.distributions,
        totalItems: response.data.totalItems,
        agentsCount: response.data.agentsCount
      });

      // Refresh agent data from backend to get updated task counts
      await onTasksDistributed();

      setFile(null);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      // Clear success message after 30 seconds
      setTimeout(() => {
        setSuccess("");
        setDistributionDetails(null);
      }, 30000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to process file. Please try again.";
      setError("❌ " + errorMessage);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-box">
      <h2>Upload CSV/Excel File</h2>
      <p className="help-text">Upload a CSV or Excel file with columns: FirstName, Phone (Notes is optional)</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {distributionDetails && (
        <div className="distribution-summary">
          <h4>Distribution Summary</h4>
          <p><strong>Total Items:</strong> {distributionDetails.totalItems}</p>
          <p><strong>Agents:</strong> {distributionDetails.agentsCount}</p>
          <div className="agent-details">
            {distributionDetails.distributions.map((dist, idx) => (
              <div key={idx} className="agent-item">
                <span className="agent-name">{dist.agentName}</span>
                <span className="item-count">{dist.itemCount} items</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="file-input">Select File:</label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept=".csv,.xls,.xlsx"
            required
            disabled={loading}
            className="file-input"
          />
          {file && <p className="file-selected">Selected: {file.name}</p>}
        </div>

        <button type="submit" disabled={loading || !file} className="btn btn-primary">
          {loading ? "Uploading..." : "Upload & Distribute"}
        </button>
      </form>

      <div className="file-requirements">
        <h4>File Requirements:</h4>
        <ul>
          <li>Format: CSV, XLS, or XLSX</li>
          <li>Max size: 10MB</li>
          <li>Required columns: FirstName, Phone, Notes</li>
          <li>Data will be distributed equally among all agents</li>
        </ul>
      </div>
    </div>
  );
}
