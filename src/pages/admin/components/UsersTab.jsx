import { useState, useEffect } from 'react';
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import api from '../../../api/axios';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/getAllUsers');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentRole) => {
    try {
      if (currentRole === 'blocked') {
        await api.patch(`/admin/unblockUser/${userId}`);
      } else {
        await api.patch(`/admin/blockUser/${userId}`);
      }
      // Optimistic update or refetch
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle user status", err);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-muted">View, manage, and moderate user accounts</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:border-primary focus:outline-none transition"
          />
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.username}</p>
                          <p className="text-sm text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border
                        ${user.role === 'admin' ? 'bg-primary/10 text-primary border-primary/30' : 
                          user.role === 'blocked' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 
                          'bg-blue-500/10 text-blue-500 border-blue-500/30'}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleToggleBlock(user.id, user.role)}
                          className={`p-2 rounded-lg transition ${
                            user.role === 'blocked' 
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                          }`}
                          title={user.role === 'blocked' ? "Unblock User" : "Block User"}
                        >
                          {user.role === 'blocked' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
