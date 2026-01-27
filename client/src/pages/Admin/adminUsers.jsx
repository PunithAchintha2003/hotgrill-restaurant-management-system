import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaTrash, FaUserShield, FaUser, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "user"
  });

  // 1. Fetch Users Function (Memoized)
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  // 2. useEffect - RUN ONCE ONLY
  // We explicitly leave the dependency array empty [] to ensure it runs only on mount.
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // 3. Add User Handler
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/users/add", newUser); 
      
      alert("User added successfully!");
      setIsModalOpen(false);
      setNewUser({ name: "", email: "", contact: "", password: "", role: "user" }); 
      fetchUsers(); // Refresh list manually
    } catch (err) {
      console.error("Add User Error:", err);
      alert(err.response?.data?.message || "Error adding user.");
    }
  };

  // 4. Delete User Handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:4000/api/users/${id}`);
        fetchUsers(); // Refresh list manually
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete user");
      }
    }
  };

  // 5. Toggle Role Handler
  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`http://localhost:4000/api/users/${user._id}`, { role: newRole });
      
      // Optimistic UI update (Instant feedback)
      setUsers(users.map((item) => 
        item._id === user._id ? { ...item, role: newRole } : item
      ));
    } catch (err) {
      console.error("Role Update Error:", err);
      alert("Failed to update role");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-25 pt-10 bg-[#333333] min-h-screen font-sans text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <p className="text-white text-2xl md:text-3xl">Manage users and roles.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 bg-[#444444] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaPlus /> Add New User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#333333] rounded-xl overflow-hidden border border-gray-600">
        <table className="w-full text-left">
          <thead className="bg-[#444444] border-b border-gray-600">
            <tr>
              <th className="p-4 text-gray-300 font-semibold">Name</th>
              <th className="p-4 text-gray-300 font-semibold">Email</th>
              <th className="p-4 text-gray-300 font-semibold">Role</th>
              <th className="p-4 text-gray-300 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-[#444444] transition-colors">
                <td className="p-4">{user.name}</td>
                <td className="p-4 text-gray-400">{user.email}</td>
                <td className="p-4">
                  <button onClick={() => toggleRole(user)} className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${user.role === 'admin' ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-blue-900 text-blue-200 hover:bg-blue-800'}`}>
                    {user.role === 'admin' ? <FaUserShield /> : <FaUser />} {user.role.toUpperCase()}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(user._id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
           <div className="bg-[#333333] p-6 rounded-2xl w-full max-w-md border border-gray-600 shadow-2xl animate-fadeIn">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Add User</h2>
                <FaTimes className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setIsModalOpen(false)} />
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input className="w-full p-2 bg-[#444444] rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500" placeholder="John Doe" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input className="w-full p-2 bg-[#444444] rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500" placeholder="email@example.com" type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Contact</label>
                    <input className="w-full p-2 bg-[#444444] rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500" placeholder="Mobile Number" required value={newUser.contact} onChange={e => setNewUser({...newUser, contact: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                    <input className="w-full p-2 bg-[#444444] rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500" placeholder="••••••••" type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                    <select className="w-full p-2 bg-[#444444] rounded border border-gray-600 text-white focus:outline-none focus:border-orange-500" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                       <option value="user">User</option>
                       <option value="admin">Admin</option>
                    </select>
                 </div>
                 <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded-lg font-bold mt-4 transition-colors">Create Account</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;