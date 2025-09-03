import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Mail, Phone, Lock } from "lucide-react";


const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 text-gray-500" size={20} />
    <input
      {...props}
      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "attendee",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/register`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(res.data.message || "Registration successful!");
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "attendee",
      });

      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
      setIsError(true);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #5A67D8, #7F9CF5, #B794F4)",
      }}
    >
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all max-w-md w-full border border-white/30">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-white mb-2 text-center tracking-tight drop-shadow-lg">
          Join EventSphere
        </h2>
        <p className="text-white/90 text-center mb-8 text-lg">
          Register as an attendee to explore events or as an organizer to host your own.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            icon={User}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />

          <InputField
            icon={Mail}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <InputField
            icon={Phone}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />

          {/* Role Toggle */}
          <div className="flex gap-3">
            {["attendee", "organizer"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`flex-1 py-2 rounded-xl font-medium transition ${
                  form.role === role
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                    : "bg-white/70 text-gray-700 hover:bg-white"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <InputField
            icon={Lock}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password (min 6 chars)"
            minLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Feedback message */}
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              isError ? "text-red-200" : "text-green-200"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
