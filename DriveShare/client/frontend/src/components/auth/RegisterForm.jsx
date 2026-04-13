import { useState } from "react";
import authService from "../../services/authService";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "renter",
    securityQuestions: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
  });

  const [message, setMessage] = useState("");

  const handleQuestionChange = (index, field, value) => {
    const updated = [...form.securityQuestions];
    updated[index][field] = value;
    setForm({ ...form, securityQuestions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(form);
      setMessage("Registration successful!");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="renter">Renter</option>
        <option value="owner">Owner</option>
      </select>

      <h3>Security Questions</h3>

      {form.securityQuestions.map((sq, index) => (
        <div key={index}>
          <input
            placeholder={`Question ${index + 1}`}
            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
          />
          <input
            placeholder="Answer"
            onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
          />
        </div>
      ))}

      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
}