import React, { useState } from 'react';
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

interface Intern {
  _id: string;
  name: string;
  email: string;
}

interface Props {
  onClose: () => void;
  projectId: string;
  interns: Intern[]; // Pass the project's interns to this component
  onTaskCreated: () => void; // Call this to refresh tasks after creation
}

export default function CreateTaskModal({ onClose, projectId, interns, onTaskCreated }: Props) {
  const [assignedTo, setAssignedTo] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ project: projectId, assignedTo, title, description, dueDate })
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      await response.json();
      alert('Task created successfully!');
      onTaskCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Intern</label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Select an Intern</option>
              {interns.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name} ({i.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Task Title</label>
            <input
              className="w-full border rounded p-2 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full border rounded p-2 mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              className="w-full border rounded p-2 mt-1"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
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
