import { useState } from 'react';
import { Search, Plus, X, MoreVertical, Edit2, Trash2, Mail, Phone, UserCheck, UserX } from 'lucide-react';
import { users as initialUsers, type AppUser } from '../../data/mockData';

type RoleType = AppUser['role'];
const ROLES: RoleType[] = ['Admin', 'Pharmacist', 'Cashier', 'Store Manager'];

const ROLE_COLORS: Record<RoleType, string> = {
  Admin: 'bg-purple-100 text-purple-700',
  Pharmacist: 'bg-blue-100 text-blue-700',
  Cashier: 'bg-green-100 text-green-700',
  'Store Manager': 'bg-amber-100 text-amber-700',
};

const AVATAR_COLORS = [
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400',
  'bg-amber-400', 'bg-pink-400', 'bg-teal-400', 'bg-indigo-400',
];

const getAvatarColor = (id: string) => {
  const idx = parseInt(id.replace(/\D/g, '')) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] || 'bg-gray-400';
};

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  status: 'Active' | 'Inactive';
}

const emptyForm: UserFormData = { name: '', email: '', phone: '', role: 'Pharmacist', status: 'Active' };

export default function ManageUsers() {
  const [userList, setUserList] = useState<AppUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState<'all' | RoleType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredUsers = userList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = activeRole === 'all' || u.role === activeRole;
    return matchSearch && matchRole;
  });

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditUser(null);
    setShowAddModal(true);
  };

  const openEditModal = (user: AppUser) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status });
    setEditUser(user);
    setShowAddModal(true);
    setActionMenu(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;
    if (editUser) {
      setUserList(prev => prev.map(u =>
        u.id === editUser.id ? { ...u, ...formData, avatar: formData.name.charAt(0).toUpperCase() } : u
      ));
    } else {
      const newUser: AppUser = {
        id: `u${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        avatar: formData.name.charAt(0).toUpperCase(),
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setUserList(prev => [newUser, ...prev]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setUserList(prev => prev.filter(u => u.id !== id));
    setDeleteConfirm(null);
    setActionMenu(null);
  };

  const toggleStatus = (id: string) => {
    setUserList(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
    setActionMenu(null);
  };

  const roleCounts = ROLES.reduce((acc, role) => {
    acc[role] = userList.filter(u => u.role === role).length;
    return acc;
  }, {} as Record<RoleType, number>);

  return (
    <div className="space-y-5">
      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[#333333]">Manage Users</h1>
          <p className="text-sm text-[#717182] mt-0.5">{userList.length} total users</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#4361EE] text-white px-4 py-2.5 rounded-xl hover:bg-[#3451DE] transition-colors text-sm shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ROLES.map(role => (
          <div key={role} className="bg-white rounded-2xl border border-gray-100 p-4">
            <span className={`text-xs px-2.5 py-1 rounded-full ${ROLE_COLORS[role]}`}>{role}</span>
            <p className="text-2xl font-medium text-[#333333] mt-3">{roleCounts[role]}</p>
            <p className="text-xs text-[#717182] mt-0.5">
              {userList.filter(u => u.role === role && u.status === 'Active').length} active
            </p>
          </div>
        ))}
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#333333] placeholder-[#717182] outline-none focus:border-[#4361EE] transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-[#717182]" />
            </button>
          )}
        </div>
      </div>

      {/* ── ROLE TABS ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveRole('all')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            activeRole === 'all'
              ? 'bg-[#4361EE] text-white'
              : 'bg-white border border-gray-200 text-[#717182] hover:border-[#4361EE] hover:text-[#4361EE]'
          }`}
        >
          All <span className={`ml-1 text-xs ${activeRole === 'all' ? 'text-white/70' : 'text-[#717182]'}`}>({userList.length})</span>
        </button>
        {ROLES.map(role => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeRole === role
                ? 'bg-[#4361EE] text-white'
                : 'bg-white border border-gray-200 text-[#717182] hover:border-[#4361EE] hover:text-[#4361EE]'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* ── USER TABLE (Desktop) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <UserCheck size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[#717182]">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">User</th>
                <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Role</th>
                <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Contact</th>
                <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Joined</th>
                <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Status</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${getAvatarColor(user.id)} flex items-center justify-center text-white text-sm font-medium shrink-0`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#333333]">{user.name}</p>
                        <p className="text-xs text-[#717182]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#717182]">
                      <Phone size={11} />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#717182]">{user.joinedDate}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#717182]'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 relative">
                    <button
                      onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                      className="text-[#717182] hover:text-[#333333] transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {actionMenu === user.id && (
                      <div className="absolute right-4 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 w-44">
                        <button
                          onClick={() => openEditModal(user)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#333333] hover:bg-gray-50"
                        >
                          <Edit2 size={14} /> Edit User
                        </button>
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#333333] hover:bg-gray-50"
                        >
                          {user.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => { setDeleteConfirm(user.id); setActionMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── USER CARDS (Mobile) ── */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <UserCheck size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[#717182]">No users found</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${getAvatarColor(user.id)} flex items-center justify-center text-white font-medium shrink-0`}>
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#333333]">{user.name}</p>
                    <p className="text-xs text-[#717182] mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#717182]'}`}>
                    {user.status}
                  </span>
                  <button
                    onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                    className="text-[#717182]"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>{user.role}</span>
                <div className="flex items-center gap-1.5 text-xs text-[#717182]">
                  <Phone size={11} /> {user.phone}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#717182]">
                  Joined: {user.joinedDate}
                </div>
              </div>
              {actionMenu === user.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 flex-wrap">
                  <button
                    onClick={() => openEditModal(user)}
                    className="flex items-center gap-1.5 text-sm text-[#4361EE] border border-[#4361EE] rounded-xl px-3 py-1.5"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="flex items-center gap-1.5 text-sm text-[#717182] border border-gray-200 rounded-xl px-3 py-1.5"
                  >
                    {user.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => { setDeleteConfirm(user.id); setActionMenu(null); }}
                    className="flex items-center gap-1.5 text-sm text-red-500 border border-red-300 rounded-xl px-3 py-1.5"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── ADD/EDIT USER MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[#333333]">{editUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#717182]">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm text-[#717182] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Dr. Adaeze Okonkwo"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-[#717182] mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@inventrii.ng"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-[#717182] mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234 801 234 5678"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Role *</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as RoleType }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] bg-white appearance-none"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] bg-white appearance-none"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-200 text-[#717182] rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email}
                className="flex-1 bg-[#4361EE] text-white rounded-xl py-2.5 text-sm hover:bg-[#3451DE] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editUser ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-center text-[#333333] mb-2">Remove User</h3>
            <p className="text-center text-sm text-[#717182] mb-6">
              Are you sure you want to remove this user? They will lose access immediately.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-[#717182] rounded-xl py-2.5 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm hover:bg-red-600">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
