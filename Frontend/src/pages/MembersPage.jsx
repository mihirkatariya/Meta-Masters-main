import React, { useState } from 'react';
import { FaUserPlus, FaUserEdit, FaUserMinus, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MemberList from '../components/MemberList';

// Sample data for activity log
const activityData = [
  { id: 1, userId: 1, userName: 'Sarah Wilson', action: 'packed', item: 'Toothbrush', timestamp: '2023-07-05T14:30:00Z' },
  { id: 2, userId: 2, userName: 'Michael Brown', action: 'packed', item: 'Power Bank', timestamp: '2023-07-05T15:45:00Z' },
  { id: 3, userId: 1, userName: 'Sarah Wilson', action: 'packed', item: 'Shampoo', timestamp: '2023-07-05T16:20:00Z' },
  { id: 4, userId: 3, userName: 'Emma Davis', action: 'joined', item: null, timestamp: '2023-07-04T09:15:00Z' },
  { id: 5, userId: 2, userName: 'Michael Brown', action: 'packed', item: 'Camera', timestamp: '2023-07-04T11:30:00Z' },
  { id: 6, userId: 1, userName: 'Sarah Wilson', action: 'packed', item: 'Water Bottles', timestamp: '2023-07-03T10:00:00Z' },
];

function MembersPage() {
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredActivities = activityData.filter(activity => {
    if (filterUser !== 'all' && activity.userId !== parseInt(filterUser)) return false;
    if (filterAction !== 'all' && activity.action !== filterAction) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header eventName="Summer Camping Trip" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Member Management</h1>
          
          {/* Member List Component */}
          <div className="mb-8">
            <MemberList />
          </div>
          
          {/* Activity Log */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Activity Log</h2>
              
              <div className="flex space-x-4">
                {/* User Filter */}
                <div className="relative">
                  <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Members</option>
                    <option value="1">Sarah Wilson</option>
                    <option value="2">Michael Brown</option>
                    <option value="3">Emma Davis</option>
                  </select>
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Action Filter */}
                <div className="relative">
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Actions</option>
                    <option value="packed">Packed</option>
                    <option value="joined">Joined</option>
                  </select>
                  <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Activity Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                            {activity.userName.charAt(0)}
                          </div>
                          <div className="ml-3 text-sm font-medium text-gray-900">{activity.userName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${activity.action === 'packed' ? 'bg-green-100 text-green-800' : 
                            activity.action === 'joined' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.item || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No activities found with the selected filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MembersPage; 