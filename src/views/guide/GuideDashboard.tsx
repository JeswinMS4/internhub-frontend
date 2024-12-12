import React, { useState, useEffect } from 'react'; 
import DashboardLayout from '../../components/layout/DashboardLayout';
import CreateMeetingModal from './CreateMeetingModal';
import CreateTaskModal from './CreateTaskModal';
// If you created a GuideReportsSection component as previously discussed
// import GuideReportsSection from './GuideReportsSection';
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
  interns: User[];
  guide: User;
}

interface Meeting {
  _id: string;
  project: { title: string; _id: string };
  guide: User;
  interns: User[];
  scheduledFor: string;
  agenda?: string;
}

interface Report {
  _id: string;
  project: { title: string, _id: string };
  intern: { name: string, email: string };
  summary: string;
  reportUrl: string;
}

export default function GuideDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const guideId = localStorage.getItem('userId');

  // State for modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentProjectForTask, setCurrentProjectForTask] = useState<Project | null>(null);

  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [currentProjectForMeeting, setCurrentProjectForMeeting] = useState<Project | null>(null);

  // Track which project's reports we are viewing
  const [currentProjectForReports, setCurrentProjectForReports] = useState<Project | null>(null);

  useEffect(() => {
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    try {
      // Fetch projects
      const projectsRes = await fetch(`${API_BASE_URL}/api/projects?guideId=${guideId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      // Fetch meetings
      const meetingsRes = await fetch(`${API_BASE_URL}/api/meetings?guideId=${guideId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const meetingsData = await meetingsRes.json();
      setMeetings(meetingsData);
    } catch (err) {
      console.error('Error fetching guide data:', err);
    }
  };

  const fetchReports = async (projectId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports?projectId=${projectId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mt-6">Guide Dashboard</h2>
        
        {/* Projects Section */}
        <div className="bg-white shadow rounded-lg mt-8 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">My Projects</h3>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500">No projects found.</p>
          ) : (
            <div className="space-y-6 max-h-[50vh] overflow-y-auto">
              {projects.map(proj => (
                <div key={proj._id} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-semibold text-gray-800">{proj.title}</h4>
                  <p className="text-sm text-gray-500 mb-1">{proj.description}</p>
                  <p className="text-sm text-gray-500 mb-2">Interns: {proj.interns.map(i => i.name).join(', ')}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setCurrentProjectForTask(proj);
                        setShowTaskModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Assign Task
                    </button>
                    <button
                      onClick={() => {
                        setCurrentProjectForMeeting(proj);
                        setShowMeetingModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Schedule Meeting
                    </button>
                    <button
                      onClick={() => {
                        setCurrentProjectForReports(proj);
                        fetchReports(proj._id);
                      }}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Reports
                    </button>
                  </div>

                  {currentProjectForReports && currentProjectForReports._id === proj._id && (
                    <div className="mt-4 bg-gray-50 p-4 rounded max-h-40 overflow-auto">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Weekly Reports</h5>
                      {reports.length === 0 ? (
                        <p className="text-xs text-gray-500">No reports found for this project.</p>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                          <thead>
                            <tr>
                              <th className="px-2 py-2 text-gray-500 uppercase">Intern</th>
                              <th className="px-2 py-2 text-gray-500 uppercase">Summary</th>
                              <th className="px-2 py-2 text-gray-500 uppercase">Report</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {reports.map(report => (
                              <tr key={report._id}>
                                <td className="px-2 py-2 whitespace-nowrap">{report.intern.name}</td>
                                <td className="px-2 py-2 whitespace-nowrap">{report.summary}</td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                  <a
                                    href={report.reportUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    View
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meetings Section */}
        <div className="bg-white shadow rounded-lg mt-8 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Meetings</h3>
          {meetings.length === 0 ? (
            <p className="text-sm text-gray-500">No meetings scheduled.</p>
          ) : (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {meetings.map(meet => (
                <div key={meet._id} className="border-b pb-2 last:border-b-0">
                  <p className="text-sm text-gray-700 font-medium">
                    {meet.project.title} - {new Date(meet.scheduledFor).toLocaleString()}
                  </p>
                  {meet.agenda && <p className="text-sm text-gray-500">Agenda: {meet.agenda}</p>}
                  <p className="text-sm text-gray-500">
                    Interns: {meet.interns.map(i => i.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showTaskModal && currentProjectForTask && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          projectId={currentProjectForTask._id}
          interns={currentProjectForTask.interns}
          onTaskCreated={fetchGuideData}
        />
      )}

      {showMeetingModal && currentProjectForMeeting && (
        <CreateMeetingModal
          onClose={() => setShowMeetingModal(false)}
          projectId={currentProjectForMeeting._id}
          interns={currentProjectForMeeting.interns}
          onMeetingCreated={fetchGuideData}
        />
      )}
    </DashboardLayout>
  );
}
