import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    const token = localUser?.token || localUser?.user?.token;
    const name = localUser?.name || localUser?.user?.name;
    const email = localUser?.email || localUser?.user?.email;

    if (token) {
      setUser({ name, email });
      setForm({ name, email, password: '' });
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const localUser = JSON.parse(localStorage.getItem('user'));
      const token = localUser?.token || localUser?.user?.token;

      const res = await axios.put(
        '/api/users/profile',
        {
          name: form.name,
          email: form.email,
          ...(form.password && { password: form.password }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Profile updated successfully');
      setUser({ name: res.data.name, email: res.data.email });
      setEditMode(false);
      setForm({ ...form, password: '' });
      localStorage.setItem('user', JSON.stringify({ ...localUser, ...res.data }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">👤 My Profile</h2>

        {!editMode ? (
          <>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Name:</span> {user.name}
            </p>
            <p className="mb-4">
              <span className="font-medium text-gray-700">Email:</span> {user.email}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password (optional)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded shadow-sm"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setForm({ name: user.name, email: user.email, password: '' });
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
