import { useState } from "react";
import api from "../api/axios";

export default function AddAgent() {
  const [form, setForm] = useState({});

  const submit = async () => {
    await api.post("/agents", form);
    alert("Agent added");
  };

  return (
    <div>
      <h3>Add Agent</h3>
      <input placeholder="Name" onChange={e => setForm({...form,name:e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form,email:e.target.value})} />
      <input placeholder="Mobile" onChange={e => setForm({...form,mobile:e.target.value})} />
      <input placeholder="Password" onChange={e => setForm({...form,password:e.target.value})} />
      <button onClick={submit}>Add</button>
    </div>
  );
}
