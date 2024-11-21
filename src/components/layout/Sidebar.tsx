import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Projects', icon: FolderKanban, href: '/projects' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Notifications', icon: Bell, href: '/notifications' },
];

export default function Sidebar({ open }: SidebarProps) {
  return (
    <div
      className={`${
        open ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col`}
    >
      <div className="flex-1 h-0 overflow-y-auto">
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon
                className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}