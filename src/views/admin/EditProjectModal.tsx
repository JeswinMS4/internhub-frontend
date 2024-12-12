import React, { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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
  startDate: string;
  endDate: string;
  guide: User;
  interns: User[];
  githubRepo: string | null;
}

interface Props {
  onClose: () => void;
  project: Project;
  guides: User[];
  internUsers: User[];
  onProjectUpdated: () => void; // callback to refresh list
}

export default function EditProjectModal({ onClose, project, guides, internUsers, onProjectUpdated }: Props) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [internshipType, setInternshipType] = useState(project.internshipType);
  const [startDate, setStartDate] = useState(project.startDate.split('T')[0]); // assuming ISO, strip time
  const [endDate, setEndDate] = useState(project.endDate.split('T')[0]);
  const [guide, setGuide] = useState(project.guide?._id || '');
  const [interns, setInterns] = useState<string[]>(project.interns.map(i => i._id));
  const [githubRepo, setGithubRepo] = useState(project.githubRepo || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          internshipType,
          startDate,
          endDate,
          guide,
          interns,
          githubRepo: githubRepo || null
        })
      });
      if (!response.ok) throw new Error('Failed to update project');
      await response.json();
      alert('Project updated successfully!');
      onProjectUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* ... similar form fields as CreateProjectModal ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input className="w-full border rounded p-2 mt-1" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="w-full border rounded p-2 mt-1" value={description} onChange={(e)=>setDescription(e.target.value)} required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Internship Type</label>
            <select className="w-full border rounded p-2 mt-1" value={internshipType} onChange={(e)=>setInternshipType(e.target.value)} required>
              <option value="">Select Type</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" className="w-full border rounded p-2 mt-1" value={startDate} onChange={(e)=>setStartDate(e.target.value)} required/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" className="w-full border rounded p-2 mt-1" value={endDate} onChange={(e)=>setEndDate(e.target.value)} required/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Guide</label>
            <select className="w-full border rounded p-2 mt-1" value={guide} onChange={(e)=>setGuide(e.target.value)} required>
              <option value="">Select Guide</option>
              {guides.map((g)=>(
                <option key={g._id} value={g._id}>{g.name} ({g.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interns</label>
            <div className="border rounded p-2 max-h-40 overflow-auto mt-1">
              {internUsers.map((iu) => {
                const isSelected = interns.includes(iu._id);
                return (
                  <div key={iu._id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isSelected}
                      onChange={() => {
                        if (isSelected) {
                          setInterns(interns.filter(id => id !== iu._id));
                        } else {
                          setInterns([...interns, iu._id]);
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">{iu.name} ({iu.email})</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub Repo (Optional)</label>
            <input className="w-full border rounded p-2 mt-1" value={githubRepo} onChange={(e)=>setGithubRepo(e.target.value)}/>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
