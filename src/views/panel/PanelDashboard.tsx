import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function PanelDashboard() {
  const upcomingDemos = [
    {
      id: 1,
      project: 'API Gateway Implementation',
      intern: 'Alice Johnson',
      date: '2024-03-25',
      time: '10:00 AM',
      status: 'scheduled',
    },
    {
      id: 2,
      project: 'Mobile App Development',
      intern: 'Bob Smith',
      date: '2024-03-27',
      time: '2:00 PM',
      status: 'pending',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900">Panel Dashboard</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Demos</h3>
            <div className="space-y-6">
              {upcomingDemos.map((demo) => (
                <div
                  key={demo.id}
                  className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{demo.project}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{demo.intern}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{demo.date}</p>
                      <p className="text-sm text-gray-500">{demo.time}</p>
                    </div>
                    <button
                      className={`btn-${
                        demo.status === 'scheduled' ? 'secondary' : 'primary'
                      }`}
                    >
                      {demo.status === 'scheduled' ? 'View Details' : 'Schedule'}
                    </button>
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