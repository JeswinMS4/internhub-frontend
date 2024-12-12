import React, { useState } from 'react';

interface Intern {
  _id: string;
  name: string;
  email: string;
}

interface Props {
  onClose: () => void;
  projectId: string;
  interns: Intern[];
  onMeetingCreated: () => void; 
}

export default function CreateMeetingModal({ onClose, projectId, interns, onMeetingCreated }: Props) {
  const [scheduledFor, setScheduledFor] = useState('');
  const [agenda, setAgenda] = useState('');
  const [selectedInterns, setSelectedInterns] = useState<string[]>(interns.map(i => i._id)); // Default to all project interns
  const [loading, setLoading] = useState(false);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ project: projectId, interns: selectedInterns, scheduledFor, agenda })
      });
      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }
      await response.json();
      alert('Meeting scheduled successfully!');
      onMeetingCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error scheduling meeting');
    } finally {
      setLoading(false);
    }
  };

  const toggleIntern = (id: string) => {
    if (selectedInterns.includes(id)) {
      setSelectedInterns(selectedInterns.filter(i => i !== id));
    } else {
      setSelectedInterns([...selectedInterns, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Schedule Meeting</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded p-2 mt-1"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Agenda</label>
            <textarea
              className="w-full border rounded p-2 mt-1"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interns</label>
            <div className="border rounded p-2 max-h-40 overflow-auto mt-1">
              {interns.map((iu) => {
                const isSelected = selectedInterns.includes(iu._id);
                return (
                  <div key={iu._id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isSelected}
                      onChange={() => toggleIntern(iu._id)}
                    />
                    <span className="text-sm text-gray-700">{iu.name} ({iu.email})</span>
                  </div>
                );
              })}
            </div>
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
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
