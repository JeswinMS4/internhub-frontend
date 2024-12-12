import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import EditProjectModal from './EditProjectModal'; // Import your EditProjectModal
import CreateProjectModal from './CreateProjectModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  internshipType: 'Summer' | 'Winter';
  status: 'active' | 'completed' | 'archived';
  startDate: string; 
  endDate: string;   
  guide: User;
  interns: User[];
  githubRepo: string | null;
  createdBy?: User;
  createdAt: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProjectForEdit, setCurrentProjectForEdit] = useState<Project | null>(null);

  const [guides, setGuides] = useState<User[]>([]);
  const [internUsers, setInternUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Fetch guides
    let response = await fetch('http://localhost:5000/api/users?role=guide', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    let data = await response.json();
    setGuides(data); 

    // Fetch interns
    response = await fetch('http://localhost:5000/api/users?role=intern', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    data = await response.json();
    data = data.filter((intern: any) => !intern.assignedProject);
    setInternUsers(data);
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      await response.json();
      alert('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error deleting project');
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent
           text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <div className="bg-white shadow rounded-lg mt-8">
      <div className="px-4 py-5 sm:p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Projects
        </h2>
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              {/* ... other headers ... */}
              <th className="px-6 py-3 bg-gray-50" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => {
              const start = format(new Date(project.startDate), 'dd MMM yyyy');
              const end = format(new Date(project.endDate), 'dd MMM yyyy');

              return (
                <tr key={project._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.internshipType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.guide ? `${project.guide.name} (${project.guide.email})` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.interns.length > 0
                      ? project.interns.map((intern) => intern.name).join(', ')
                      : 'No interns assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {start} - {end}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.githubRepo ? (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Repo
                      </a>
                    ) : (
                      'No Repo'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setCurrentProjectForEdit(project);
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showEditModal && currentProjectForEdit && (
        <EditProjectModal
          onClose={() => setShowEditModal(false)}
          project={currentProjectForEdit}
          guides={guides}
          internUsers={internUsers}
          onProjectUpdated={fetchProjects}
        />
      )}
    </div>
  );
}
