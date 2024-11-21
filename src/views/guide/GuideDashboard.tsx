import React from 'react';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function GuideDashboard() {
  const assignedInterns = [
    {
      id: 1,
      name: 'Alice Johnson',
      project: 'API Gateway Implementation',
      status: 'on_track',
      lastUpdate: '2 days ago',
    },
    {
      id: 2,
      name: 'Bob Smith',
      project: 'Mobile App Development',
      status: 'needs_attention',
      lastUpdate: '5 days ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900">Guide Dashboard</h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button className="btn-primary">Schedule Review</button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Interns</h3>
            <div className="space-y-6">
              {assignedInterns.map((intern) => (
                <div
                  key={intern.id}
                  className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{intern.name}</p>
                      <p className="text-sm text-gray-500">{intern.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {intern.status === 'on_track' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-500">
                      Updated {intern.lastUpdate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}