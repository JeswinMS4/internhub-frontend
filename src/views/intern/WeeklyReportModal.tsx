import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  projectId: string;
  onReportCreated: () => void; // Callback to refresh reports if needed
}
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function WeeklyReportModal({ onClose, projectId, onReportCreated }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('report', file);
      formData.append('summary', summary);
      formData.append('projectId', projectId);

      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to upload report');
      }
      await response.json();
      alert('Weekly report uploaded successfully!');
      onReportCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error uploading report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Weekly Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        <form onSubmit={handleUpload} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report File (PDF/DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea
              className="w-full border rounded p-2 mt-1"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
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
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
