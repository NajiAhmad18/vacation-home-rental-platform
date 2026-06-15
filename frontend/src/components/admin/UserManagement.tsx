import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  UserX,
  Download
} from 'lucide-react';


const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock user data
  const users = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      joinDate: '2023-01-15',
      lastLogin: '2024-01-15 10:30 AM'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 234-5678',
      role: 'Manager',
      status: 'Active',
      joinDate: '2023-02-20',
      lastLogin: '2024-01-14 3:45 PM'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      phone: '+1 (555) 345-6789',
      role: 'User',
      status: 'Inactive',
      joinDate: '2023-03-10',
      lastLogin: '2024-01-10 9:15 AM'
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      phone: '+1 (555) 456-7890',
      role: 'Editor',
      status: 'Active',
      joinDate: '2023-04-05',
      lastLogin: '2024-01-15 2:20 PM'
    },
    {
      id: '5',
      name: 'Tom Brown',
      email: 'tom.brown@example.com',
      phone: '+1 (555) 567-8901',
      role: 'User',
      status: 'Pending',
      joinDate: '2024-01-12',
      lastLogin: 'Never'
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      phone: '+1 (555) 678-9012',
      role: 'Manager',
      status: 'Active',
      joinDate: '2023-05-18',
      lastLogin: '2024-01-13 11:45 AM'
    },
    {
      id: '7',
      name: 'David Miller',
      email: 'david.miller@example.com',
      phone: '+1 (555) 789-0123',
      role: 'User',
      status: 'Active',
      joinDate: '2023-06-22',
      lastLogin: '2024-01-14 8:30 AM'
    },
    {
      id: '8',
      name: 'Jennifer Garcia',
      email: 'jennifer.garcia@example.com',
      phone: '+1 (555) 890-1234',
      role: 'Editor',
      status: 'Inactive',
      joinDate: '2023-07-30',
      lastLogin: '2024-01-08 4:15 PM'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: 'bg-green-100 text-green-800 border-green-200',
      Inactive: 'bg-red-100 text-red-800 border-red-200',
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      Admin: 'bg-purple-100 text-purple-800 border-purple-200',
      Manager: 'bg-blue-100 text-blue-800 border-blue-200',
      Editor: 'bg-orange-100 text-orange-800 border-orange-200',
      User: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const roleIcons = {
      Admin: ShieldCheck,
      Manager: Shield,
      Editor: Edit,
      User: UserX
    };
    
    const Icon = roleIcons[role as keyof typeof roleIcons];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${roleStyles[role as keyof typeof roleStyles]}`}>
        <Icon size={12} className="mr-1" />
        {role}
      </span>
    );
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Active').length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'Pending').length}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'Admin').length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Editor">Editor</option>
                <option value="User">User</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedUsers.length > 0 && (
                <span className="text-sm text-slate-600">
                  {selectedUsers.length} selected
                </span>
              )}
              <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter size={16} />
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-green-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No users found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;