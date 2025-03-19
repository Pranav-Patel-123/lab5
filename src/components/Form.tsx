// components/Form.tsx
"use client";
import { useState } from "react";

export default function Form() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: parseInt(age) }),
      });
      if (response.ok) {
        alert("Data saved successfully!");
        setName("");
        setAge("");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Store User Data</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border mb-2" />
      <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-2 border mb-2" />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-2">Submit</button>
    </form>
  );
}
