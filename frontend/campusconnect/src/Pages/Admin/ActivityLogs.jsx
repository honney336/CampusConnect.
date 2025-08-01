import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaFilter, 
  FaDownload, 
  FaTrash,
  FaChartBar,
  FaSearch,
  FaEye,
  FaDatabase
} from 'react-icons/fa';
import { 
  getAllActivityLogs, 
  getActivityLogStats, 
  deleteOldActivityLogs,
  getActivityLogsByEntityType 
} from '../../API/API';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20);
  const [showStats, setShowStats] = useState(false);

  const entityTypes = ['All', 'user', 'course', 'enrollment', 'notes', 'event', 'announcement'];
  const actionTypes = ['All', 'login', 'login_failed', 'CREATE', 'UPDATE', 'DELETE', 'LOGOUT', 'VIEW'];

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching activity logs...');
      const response = await getAllActivityLogs();
      console.log('Activity logs response:', response);
      
      if (response?.data?.success) {
        setLogs(response.data.logs || []);
      } else {
        setError(response?.data?.message || 'Failed to fetch activity logs');
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      
      // More specific error messages
      if (err.message.includes("endpoint not found")) {
        setError("Backend route not configured. Please ensure activity log routes are registered in your server.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized access. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError("Cannot connect to backend server. Please ensure the backend is running on the correct port.");
      } else {
        setError(`Error fetching activity logs: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching activity stats...');
      const response = await getActivityLogStats();
      console.log('Activity stats response:', response);
      
      if (response?.data?.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Don't show error for stats, it's optional
    }
  };

  const handleEntityFilterChange = async (entityType) => {
    setEntityFilter(entityType);
    if (entityType === 'All') {
      fetchLogs();
    } else {
      try {
        setLoading(true);
        const response = await getActivityLogsByEntityType(entityType);
        if (response.data.success) {
          setLogs(response.data.logs);
        }
      } catch (err) {
        setError('Error filtering logs: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCleanup = async () => {
    if (window.confirm('Are you sure you want to delete logs older than 90 days?')) {
      try {
        const response = await deleteOldActivityLogs(90);
        if (response.data.success) {
          // Show more informative message
          const message = response.data.deletedCount > 0 
            ? `Successfully deleted ${response.data.deletedCount} old logs`
            : 'No logs older than 90 days found to delete';
          alert(message);
          fetchLogs();
          fetchStats();
        }
      } catch (err) {
        alert('Error cleaning up logs: ' + err.message);
      }
    }
  };

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      login: 'bg-purple-100 text-purple-800',
      login_failed: 'bg-red-100 text-red-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      VIEW: 'bg-yellow-100 text-yellow-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const getEntityTypeColor = (entityType) => {
    const colors = {
      user: 'bg-indigo-100 text-indigo-800',
      course: 'bg-blue-100 text-blue-800',
      enrollment: 'bg-green-100 text-green-800',
      notes: 'bg-yellow-100 text-yellow-800',
      event: 'bg-purple-100 text-purple-800',
      announcement: 'bg-red-100 text-red-800'
    };
    return colors[entityType] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Loading activity logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
              <p className="text-gray-600">Monitor system activity and user actions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaChartBar className="mr-2" />
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
              <button
                onClick={handleCleanup}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FaTrash className="mr-2" />
                Cleanup Old Logs
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStats && stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalLogs}</div>
                <div className="text-blue-600">Total Logs</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.recentActivity}</div>
                <div className="text-green-600">Last 24 Hours</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.logsByEntityType?.length || 0}</div>
                <div className="text-purple-600">Entity Types</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.logsByAction?.length || 0}</div>
                <div className="text-yellow-600">Action Types</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={entityFilter}
              onChange={(e) => handleEntityFilterChange(e.target.value)}
            >
              {entityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              {actionTypes.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 flex items-center">
              <FaDatabase className="mr-2" />
              {filteredLogs.length} logs found
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.user}</div>
                          <div className="text-sm text-gray-500">{log.userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityTypeColor(log.entityType)}`}>
                        {log.entityType}
                      </span>
                      {log.entityId && (
                        <div className="text-xs text-gray-500 mt-1">ID: {log.entityId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {log.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstLog + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastLog, filteredLogs.length)}</span> of{' '}
                    <span className="font-medium">{filteredLogs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
