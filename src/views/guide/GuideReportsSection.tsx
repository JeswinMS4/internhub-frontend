import React, { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function GuideReportsSection({ projectId }) {
  const [reports, setReports] = useState([]);
  const guideId = localStorage.getItem('userId');

  useEffect(() => {
    fetchReports();
  }, [projectId]);

  const fetchReports = async () => {
    const url = projectId
      ? `${API_BASE_URL}/api/reports?projectId=${projectId}`
      : `${API_BASE_URL}/api/reports`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setReports(data);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Reports</h3>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
              <th className="px-6 py-3 bg-gray-50" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map(report => (
              <tr key={report._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.intern.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.summary}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={report.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Report
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
