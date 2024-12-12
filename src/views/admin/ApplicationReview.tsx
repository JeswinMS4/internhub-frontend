import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, User, Loader } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { format } from 'date-fns';

interface Application {
  _id: string;
  name: string;
  email: string;
  highestQualification: string;
  institution: string;
  status: string;
  submittedAt: string;
  resumeUrl: string;
}

export default function ApplicationReview() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  
  // New state for modal
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [internEmail, setInternEmail] = useState('');
  const [internPassword, setInternPassword] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApproveModal = (id: string) => {
    setSelectedApplicationId(id);
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setSelectedApplicationId(null);
    setInternEmail('');
    setInternPassword('');
  };

  const handleApprove = async (id: string) => {
    if (!id) return;
    if (!internEmail.endsWith('@internhub.com')) {
      alert('Email must end with @internhub.com');
      return;
    }

    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internEmail, internPassword })
      });
      if (!response.ok) {
        throw new Error('Failed to approve application');
      }
      setApplications((prev) => prev.map((app) => (app._id === id ? { ...app, status: 'approved' } : app)));
      handleCloseApproveModal();
    } catch (err) {
      console.error(err);
      alert('Error approving application');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject application');
      }
      setApplications((prev) => prev.map((app) => (app._id === id ? { ...app, status: 'rejected' } : app)));
    } catch (err) {
      console.error(err);
      alert('Error rejecting application');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <p>Loading applications...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchApplications}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900">Internship Applications</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {applications.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Education
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resume
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => {
                      const isLoadingAction = actionLoading[application._id];
                      const isApproved = application.status === 'approved';
                      const isRejected = application.status === 'rejected';
                      const isPending = application.status === 'pending';

                      return (
                        <tr key={application._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <User className="h-8 w-8 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{application.name}</div>
                                <div className="text-sm text-gray-500">{application.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.highestQualification}</div>
                            <div className="text-sm text-gray-500">{application.institution}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(application.submittedAt), 'dd MMM yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                isApproved
                                  ? 'bg-green-100 text-green-800'
                                  : isRejected
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {application.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleOpenApproveModal(application._id)}
                                  aria-label={`Approve application from ${application.name}`}
                                  className="text-green-600 hover:text-green-900 mr-4"
                                  disabled={isLoadingAction}
                                >
                                  {isLoadingAction ? (
                                    <Loader className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReject(application._id)}
                                  aria-label={`Reject application from ${application.name}`}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={isLoadingAction}
                                >
                                  {isLoadingAction ? (
                                    <Loader className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <XCircle className="h-5 w-5" />
                                  )}
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => handleReject(application._id)}
                                aria-label={`Reject application from ${application.name}`}
                                className="text-red-600 hover:text-red-900"
                                disabled={isLoadingAction}
                              >
                                {isLoadingAction ? (
                                  <Loader className="h-5 w-5 animate-spin" />
                                ) : (
                                  <XCircle className="h-5 w-5" />
                                )}
                              </button>
                            )}

                            {isRejected && (
                              <button
                                onClick={() => handleOpenApproveModal(application._id)}
                                aria-label={`Approve application from ${application.name}`}
                                className="text-green-600 hover:text-green-900"
                                disabled={isLoadingAction}
                              >
                                {isLoadingAction ? (
                                  <Loader className="h-5 w-5 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-5 w-5" />
                                )}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.resumeUrl ? (
                              <a
                                href={application.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View Resume
                              </a>
                            ) : (
                              <span className="text-gray-500">No Resume</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Enter Intern Credentials</h2>
              <label className="block text-sm font-medium text-gray-700 mt-2">Intern Email (@internhub.com)</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={internEmail}
                onChange={(e) => setInternEmail(e.target.value)}
                placeholder="example@internhub.com"
              />
              <label className="block text-sm font-medium text-gray-700 mt-2">Intern Password</label>
              <input
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={internPassword}
                onChange={(e) => setInternPassword(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCloseApproveModal}
                  className="mr-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedApplicationId) {
                      handleApprove(selectedApplicationId);
                    }
                  }}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
