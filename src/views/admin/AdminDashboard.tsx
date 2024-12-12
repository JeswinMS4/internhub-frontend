import React, { useState, useEffect } from 'react';
import { Users, FolderKanban, Calendar, Award } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import CreateProjectModal from './CreateProjectModal';
import ProjectsList from './ProjectsList';
// import dotenv from 'dotenv';

// // Load the `.env` file
// dotenv.config();

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

interface Stat {
  title: string;
  value: string;
  icon: React.ComponentType;
  trend: { value: number; label: string };
}
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [statsP, setPStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string>('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setUsersError('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  useEffect(() => {
    fetchPStats();
  }, []);
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();

      setStats([
        {
          title: 'Total Applications',
          value: data.totalApplications.toString(),
          icon: Users,
          trend: { value: data.newApplications, label: 'New this month' },
        },
        // Add more stats as needed
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };
  const fetchPStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();

      setPStats([
        {
          title: 'Total Projects',
          value: data.totalProjects.toString(),
          icon: FolderKanban,
          trend: { value: data.newProjects, label: 'New this month' },
        },
        // Add more stats as needed
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard Overview
            </h2>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statsP.map((statp) => (
              <StatCard key={statp.title} {...statp} />
            ))}
          </div>

          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Controls
              </h2>
              <div className="mt-4">
              </div>
              <div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent
               text-base font-medium rounded-md shadow-sm text-white bg-indigo-600
               hover:bg-indigo-700 focus:outline-none"
            >
              Create Project
            </button>
          </div>
          {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}
            </div>
          </div>
        </div>
        <ProjectsList />
        <div className="bg-white shadow rounded-lg mt-8">
          {}
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Users
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button onClick={() => setShowCreateUserModal(true)} className="btn-primary">Create User</button>
          </div>
        </div>

        {loadingUsers && <p>Loading users...</p>}
        {usersError && (
          <div>
            <p className="text-red-500">{usersError}</p>
            <button onClick={fetchUsers} className="btn-secondary">Retry</button>
          </div>
        )}
        {!loadingUsers && !usersError && users.length === 0 && <p>No users found.</p>}

        {!loadingUsers && !usersError && users.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 bg-gray-50" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setEditUserId(user._id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showCreateUserModal && (
          <CreateUserModal
            onClose={() => {
              setShowCreateUserModal(false);
              fetchUsers();
            }}
          />
        )}

        {editUserId && (
          <EditUserModal
            userId={editUserId}
            onClose={() => {
              setEditUserId(null);
              fetchUsers();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleCreate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating user');
    }
  };

  return (
    <Modal title="Create User" onClose={onClose}>
      <input className="border p-2 w-full mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <select className="border p-2 w-full mb-4" value={role} onChange={e => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="program_manager">Program Manager</option>
        <option value="guide">Guide</option>
        <option value="intern">Intern</option>
        <option value="panel_member">Panel Member</option>
      </select>
      <button onClick={handleCreate} className="btn-primary w-full">Create</button>
    </Modal>
  );
}

function EditUserModal({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setUserData(data);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          role: userData.role
          // password only if changed
        })
      });
      if (!response.ok) throw new Error('Failed to update user');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating user');
    }
  };

  if (!userData) return <Modal title="Edit User" onClose={onClose}><p>Loading...</p></Modal>;

  return (
    <Modal title="Edit User" onClose={onClose}>
      <input className="border p-2 w-full mb-2" placeholder="Name" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
      <input className="border p-2 w-full mb-2" placeholder="Email" value={userData.email} onChange={e => setUserData({ ...userData, email: e.target.value })} />
      <select className="border p-2 w-full mb-4" value={userData.role} onChange={e => setUserData({ ...userData, role: e.target.value })}>
        <option value="admin">Admin</option>
        <option value="program_manager">Program Manager</option>
        <option value="guide">Guide</option>
        <option value="intern">Intern</option>
        <option value="panel_member">Panel Member</option>
      </select>
      <button onClick={handleUpdate} className="btn-primary w-full">Update</button>
    </Modal>
  );
}

// A simple Modal component can be implemented or replaced with your existing UI library
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        {children}
      </div>
    </div>
  );
}


