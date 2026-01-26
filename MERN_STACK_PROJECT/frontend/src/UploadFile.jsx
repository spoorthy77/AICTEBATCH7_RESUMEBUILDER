import { useState } from "react";
import api from "../api/axios";

export default function UploadFile() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const data = new FormData();
    data.append("file", file);
    await api.post("/upload", data);
    alert("Uploaded & distributed");
  };

  return (
    <div>
      <h3>Upload CSV / Excel</h3>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
}
