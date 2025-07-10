import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const backendURL = "http://localhost:5000";

const AdminUserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(null);

  const token = user?.token;

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedUsers = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${backendURL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen pt-[72px] bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          👥 Users List
        </h1>

        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            className="w-full sm:w-96 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-gray-400 animate-pulse text-center mt-8">
            Fetching users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 italic">
            No users found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg bg-gray-900 text-gray-100 border border-gray-700">

              <table className="min-w-full table-auto divide-y divide-gray-700">
                <thead className="bg-gray-800 text-blue-300 sticky top-0 z-10">


                  <tr className="border-b border-gray-800 hover:bg-gray-800 transition">


                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
               <tbody>
  {currentUsers.map(({ _id, name, email, role }, index) => (
    <tr
      key={_id}
      className="border-b border-gray-800 hover:bg-gray-800 transition"
    >
      <td className="px-6 py-4">{name}</td>
      <td className="px-6 py-4 break-all flex items-center gap-2">
        <span>{email}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(email);
            toast.success("Email copied!");
          }}
          title="Copy email"
          className="text-blue-400 hover:text-blue-600 text-sm"
        >
          📋
        </button>
      </td>
      <td className="px-6 py-4 capitalize">{role}</td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => deleteUser(_id)}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 text-white rounded-md text-sm"
        >
          🗑️ Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                ◀ Prev
              </button>
              <span className="text-white font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
