import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  onClose: () => void;
}

export default function CreateProjectModal({ onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [internshipType, setInternshipType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guide, setGuide] = useState('');
  const [interns, setInterns] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState('');

  const [guides, setGuides] = useState<User[]>([]);
  const [internUsers, setInternUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Fetch guides
    let response = await fetch('http://localhost:5000/api/users?role=guide', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    let data = await response.json();
    setGuides(data); // now only guides are in 'guides' array
  
    // Fetch interns
    response = await fetch('http://localhost:5000/api/users?role=intern', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    data = await response.json();
  
    // Filter out interns already assigned to another project
    // Assuming 'assignedProject' field in user schema
    data = data.filter(intern => !intern.assignedProject);
    
    setInternUsers(data); // now internUsers contains only free interns
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
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
          githubRepo: githubRepo || null,
          // createdBy: you can pass the admin user ID if you track it in frontend or decode from token
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();
      alert('Project created successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl max-h-[80vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mt-2">Title</label>
          <input
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-2">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-2">Internship Type</label>
          <select
            className="w-full border rounded p-2"
            value={internshipType}
            onChange={(e) => setInternshipType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-2">Start Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-2">End Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-2">Guide</label>
          <select
            className="w-full border rounded p-2"
            value={guide}
            onChange={(e) => setGuide(e.target.value)}
            required
          >
            <option value="">Select Guide</option>
            {guides.map((g) => (
  <option key={g._id} value={g._id}>
    {g.name} ({g.email})
  </option>
))}
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-2">Interns</label>
<div className="border rounded p-2 max-h-40 overflow-auto">
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
              // If already selected, remove from interns
              setInterns(interns.filter(id => id !== iu._id));
            } else {
              // If not selected, add intern ID
              setInterns([...interns, iu._id]);
            }
          }}
        />
        <span className="text-sm text-gray-700">{iu.name} ({iu.email})</span>
      </div>
    );
  })}
</div>

          <label className="block text-sm font-medium text-gray-700 mt-2">GitHub Repo (Optional)</label>
          <input
            className="w-full border rounded p-2"
            value={githubRepo}
            onChange={(e) => setGithubRepo(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
