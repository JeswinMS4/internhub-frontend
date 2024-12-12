import React, { useState, useEffect } from 'react'; 
import { GitBranch, MessageSquare, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AddFeedbackModal from './AddFeedbackModal';
import WeeklyReportModal from './WeeklyReportModal';
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export default function InternDashboard() {
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const internId = localStorage.getItem('userId');

  // State for modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchProjectAndTasks();
  }, []);

  const fetchProjectAndTasks = async () => {
    try {
      const projectRes = await fetch(`${API_BASE_URL}/api/projects?internId=${internId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const projectsData = await projectRes.json();
      const currentProject = projectsData[0]; // assuming one project per intern
      setProject(currentProject);

      const tasksRes = await fetch(`${API_BASE_URL}/api/tasks?assignedTo=${internId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (taskId: string, feedback: string) => {
    await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ feedback })
    });
    // Refresh tasks
    fetchProjectAndTasks();
  };

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            {project && (
              <button
                onClick={() => setShowReportModal(true)}
                className="btn-primary"
              >
                Add Weekly Report
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Project Overview */}
          {project && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Project</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <GitBranch className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{project.title}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Guide: {project.guide?.name}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {project.internshipType} Internship
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tasks */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">My Tasks</h3>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">{task.title}</span>
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                    <span className="text-xs text-gray-500">Status: {task.status}</span>
                    <button
                      onClick={() => {
                        setCurrentTaskId(task._id);
                        setShowFeedbackModal(true);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-900 mt-1"
                    >
                      Add Feedback
                    </button>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p>No tasks assigned yet.</p>}
            </div>
          </div>
        </div>
      </div>

      {showFeedbackModal && currentTaskId && (
        <AddFeedbackModal
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={(feedback) => {
            handleFeedback(currentTaskId, feedback);
            setShowFeedbackModal(false);
          }}
        />
      )}

      {showReportModal && project && (
        <WeeklyReportModal
          onClose={() => setShowReportModal(false)}
          projectId={project._id}
          onReportCreated={() => {
            // If needed, fetch reports or notify user. For now, just close.
          }}
        />
      )}
    </DashboardLayout>
  );
}




// import React from 'react';
// import { Calendar, GitBranch, MessageSquare, Clock } from 'lucide-react';
// import DashboardLayout from '../../components/layout/DashboardLayout';

// export default function InternDashboard() {
//   const weeklyTasks = [
//     { id: 1, title: 'Complete API integration', status: 'in_progress', dueDate: '2024-03-20' },
//     { id: 2, title: 'Write unit tests', status: 'todo', dueDate: '2024-03-22' },
//     { id: 3, title: 'Update documentation', status: 'completed', dueDate: '2024-03-19' },
//   ];

//   return (
//     <DashboardLayout>
//       <div className="max-w-7xl mx-auto">
//         <div className="md:flex md:items-center md:justify-between mb-8">
//           <div className="flex-1 min-w-0">
//             <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
//           </div>
//           <div className="mt-4 flex md:mt-0 md:ml-4">
//             <button className="btn-primary">Submit Weekly Report</button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           {/* Project Overview */}
//           <div className="bg-white shadow rounded-lg p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Current Project</h3>
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <GitBranch className="h-5 w-5 text-gray-400 mr-2" />
//                 <span className="text-sm text-gray-600">API Gateway Implementation</span>
//               </div>
//               <div className="flex items-center">
//                 <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
//                 <span className="text-sm text-gray-600">Guide: Sarah Connor</span>
//               </div>
//               <div className="flex items-center">
//                 <Clock className="h-5 w-5 text-gray-400 mr-2" />
//                 <span className="text-sm text-gray-600">Week 6 of 12</span>
//               </div>
//             </div>
//           </div>

//           {/* Weekly Tasks */}
//           <div className="bg-white shadow rounded-lg p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Tasks</h3>
//             <div className="space-y-4">
//               {weeklyTasks.map((task) => (
//                 <div key={task.id} className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div
//                       className={`h-2.5 w-2.5 rounded-full mr-2 ${
//                         task.status === 'completed'
//                           ? 'bg-green-400'
//                           : task.status === 'in_progress'
//                           ? 'bg-yellow-400'
//                           : 'bg-gray-400'
//                       }`}
//                     />
//                     <span className="text-sm text-gray-600">{task.title}</span>
//                   </div>
//                   <span className="text-xs text-gray-500">{task.dueDate}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }