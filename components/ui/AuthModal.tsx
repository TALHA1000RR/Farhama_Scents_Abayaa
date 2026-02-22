"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  setMode: (mode: "signin" | "signup") => void;
}

// Dummy user data
const USERS = [
  { email: "admin@farhama.com", password: "admin123", role: "admin", name: "Admin User" },
  { email: "user@farhama.com", password: "user123", role: "user", name: "John Doe" },
];

export default function AuthModal({ isOpen, onClose, mode, setMode }: AuthModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (mode === "signin") {
      // Sign in logic
      const user = USERS.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          onClose();
          alert(`Welcome back, ${user.name}!`);
        }
      } else {
        setError("Invalid email or password");
      }
    } else {
      // Sign up logic
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.name,
      };

      // Store user info
      localStorage.setItem("user", JSON.stringify(newUser));

      if (newUser.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        onClose();
        alert(`Welcome to Farhama, ${newUser.name}!`);
      }
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <h2 className="text-3xl font-extrabold tracking-wide text-center mb-2">
            {mode === "signin" ? "WELCOME BACK" : "JOIN FARHAMA"}
          </h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            {mode === "signin"
              ? "Sign in to access your account"
              : "Create your account to get started"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                placeholder="••••••••"
                required
              />
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Account Type</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                  >
                    <option value="user">General User</option>
                    <option value="admin">Admin User</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 tracking-widest font-semibold hover:bg-brandGold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "PROCESSING..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError("");
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "user",
                  });
                }}
                className="text-black font-semibold hover:text-brandGold transition"
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded text-xs">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p><strong>Admin:</strong> admin@farhama.com / admin123</p>
            <p><strong>User:</strong> user@farhama.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}