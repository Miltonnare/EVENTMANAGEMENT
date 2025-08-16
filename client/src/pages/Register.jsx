import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "attendee", // default
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      // console.log("ENV:", import.meta.env);

      // console.log("AUTH URL",import.meta.env.VITE_API_AUTH_URL);
      const res = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/register`,
        form,
        config
      );
     
      setMessage(res.data.message || "Registration successful!");
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "attendee",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #5A67D8, #7F9CF5, #B794F4)", // Blue-light violet gradient
      }}
    >
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(255,255,255,0.4)] max-w-md w-full border border-white/30">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-white mb-2 text-center tracking-tight drop-shadow-lg">
          Join EventSphere
        </h2>
        <p className="text-white/90 text-center mb-8 text-lg">
          Register as an attendee to explore events or as an organizer to host your own.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-white font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-white font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-white font-semibold mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-white font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
