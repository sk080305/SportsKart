import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const token = localUser?.token || localUser?.user?.token;
    const name = localUser?.name || localUser?.user?.name;
    const email = localUser?.email || localUser?.user?.email;

    if (token) {
      setUser({ name, email });
      setForm({ name, email, password: "" });
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));
      const token = localUser?.token || localUser?.user?.token;

      const res = await axios.put(
        "/api/users/profile",
        {
          name: form.name,
          email: form.email,
          ...(form.password && { password: form.password }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profile updated successfully");
      setUser({ name: res.data.name, email: res.data.email });
      setEditMode(false);
      setForm({ ...form, password: "" });
      localStorage.setItem("user", JSON.stringify({ ...localUser, ...res.data }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-gray-900 to-black text-white px-4 py-10 pt-14">
      <div className="max-w-xl mx-auto bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center">
          My Profile
        </h2>

        {!editMode ? (
          <>
            <div className="mb-6 space-y-2">
              <p>
                <span className="text-gray-400 font-medium">Name:</span> {user.name}
              </p>
              <p>
                <span className="text-gray-400 font-medium">Email:</span> {user.email}
              </p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 text-black px-5 py-2 rounded hover:bg-yellow-400 transition w-full"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setForm({ name: user.name, email: user.email, password: "" });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
