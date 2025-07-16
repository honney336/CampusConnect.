import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserRole, getUsername } from '../auth';
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  Megaphone, 
  Users, 
  TrendingUp,
  Clock,
  Bell
} from 'lucide-react';
import { courseService } from '../services/courseService';
import { announcementService } from '../services/announcementService';
import { eventService } from '../services/eventService';
import Spinner from '../components/Spinner';

const Home = () => {
  const [stats, setStats] = useState({
    courses: 0,
    announcements: 0,
    events: 0
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userRole = getUserRole();
  const username = getUsername();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, announcementsRes, eventsRes] = await Promise.all([
        courseService.getAllCourses(),
        announcementService.getAllAnnouncements(),
        eventService.getAllEvents()
      ]);

      setStats({
        courses: coursesRes.courses?.length || 0,
        announcements: announcementsRes.announcements?.length || 0,
        events: eventsRes.events?.length || 0
      });

      // Get recent announcements (last 3)
      setRecentAnnouncements(announcementsRes.announcements?.slice(0, 3) || []);
      
      // Get upcoming events (next 3)
      const upcoming = eventsRes.events?.filter(event => 
        new Date(event.eventDate) > new Date()
      ).slice(0, 3) || [];
      setUpcomingEvents(upcoming);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, link }) => (
    <Link to={link} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  const QuickActionCard = ({ icon: Icon, title, description, link, color }) => (
    <Link to={link} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className={`p-3 rounded-full ${color} w-fit mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening in your campus today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats.courses}
            color="bg-blue-500"
            link="/courses"
          />
          <StatCard
            icon={Megaphone}
            title="Announcements"
            value={stats.announcements}
            color="bg-green-500"
            link="/announcements"
          />
          <StatCard
            icon={Calendar}
            title="Upcoming Events"
            value={stats.events}
            color="bg-purple-500"
            link="/events"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Announcements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Recent Announcements
              </h2>
              <Link to="/announcements" className="text-blue-600 hover:text-blue-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map((announcement, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      By {announcement.creator?.username} • {announcement.announcementType}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent announcements</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Upcoming Events
              </h2>
              <Link to="/events" className="text-purple-600 hover:text-purple-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(event.eventDate).toLocaleDateString()} • {event.eventType}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon={BookOpen}
              title="Browse Courses"
              description="Explore available courses and enroll"
              link="/courses"
              color="bg-blue-500"
            />
            <QuickActionCard
              icon={FileText}
              title="Study Notes"
              description="Access course materials and notes"
              link="/notes"
              color="bg-green-500"
            />
            <QuickActionCard
              icon={Calendar}
              title="Events Calendar"
              description="View upcoming events and deadlines"
              link="/events"
              color="bg-purple-500"
            />
            <QuickActionCard
              icon={Megaphone}
              title="Announcements"
              description="Stay updated with latest news"
              link="/announcements"
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Role-specific sections */}
        {userRole === 'admin' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove users</p>
              </Link>
              <Link to="/admin/courses" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <BookOpen className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium">Course Management</h3>
                <p className="text-sm text-gray-600">Oversee all courses</p>
              </Link>
              <Link to="/admin/analytics" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-gray-600">View system statistics</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;