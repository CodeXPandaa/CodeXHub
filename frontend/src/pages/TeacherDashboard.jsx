import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, analyticsAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';
import { Users, FileText, CheckCircle, XCircle, BarChart3, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getTeacherAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId) => {
    try {
      await projectsAPI.approveProject(projectId);
      toast.success('Project approved successfully');
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve project');
    }
  };

  const handleReject = async (projectId) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await projectsAPI.rejectProject(projectId, reason || '');
      toast.success('Project rejected');
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject project');
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, <Link to="/profile" className="font-medium text-primary-600 hover:underline">{user.name}</Link>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'approvals'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Approvals ({analytics?.pendingApprovals?.length || 0})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && analytics && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.statistics.totalProjects}
                  </p>
                </div>
                <FileText className="h-10 w-10 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {analytics.statistics.pendingProjects}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.statistics.approvedProjects}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {analytics.statistics.avgProgress}%
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Status Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pending', value: analytics.charts.statusDistribution.pending },
                      { name: 'Approved', value: analytics.charts.statusDistribution.approved },
                      { name: 'Completed', value: analytics.charts.statusDistribution.completed },
                      { name: 'Rejected', value: analytics.charts.statusDistribution.rejected },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Pending' },
                      { name: 'Approved' },
                      { name: 'Completed' },
                      { name: 'Rejected' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { range: '0-25%', count: analytics.charts.progressRanges['0-25%'] },
                    { range: '26-50%', count: analytics.charts.progressRanges['26-50%'] },
                    { range: '51-75%', count: analytics.charts.progressRanges['51-75%'] },
                    { range: '76-100%', count: analytics.charts.progressRanges['76-100%'] },
                  ]}
                >
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projects Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Projects</h2>
            {analytics.projects.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                <p className="text-gray-600">
                  Projects will appear here once students submit requests
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.projects.map((project) => (
                  <ProjectCard key={project._id} project={project} role="teacher" />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {analytics.recentWPRs.length === 0 ? (
              <p className="text-gray-600">No recent WPR submissions</p>
            ) : (
              <div className="space-y-4">
                {analytics.recentWPRs.map((wpr) => (
                  <div
                    key={wpr._id}
                    className="border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{wpr.project?.title}</p>
                        <p className="text-sm text-gray-600">
                          Week {wpr.weekNumber} - {wpr.submittedBy?.name}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(wpr.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{wpr.progressDescription}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approvals</h2>
          {analytics?.pendingApprovals?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending project approvals</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics?.pendingApprovals?.map((project) => (
                    <tr key={project._id}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{project.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {project.students?.map((student) => (
                            <div key={student._id} className="text-sm text-gray-900">
                              {student.name}
                              <span className="text-gray-500 ml-2">
                                ({student.semester} - {student.department})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Semester {project.semester}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(project._id)}
                            className="btn-primary text-sm py-1 px-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(project._id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
