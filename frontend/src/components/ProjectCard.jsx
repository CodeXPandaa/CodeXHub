import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, role }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const studentCount = Array.isArray(project.students) ? project.students.length : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="space-y-2 mb-4">
        {role === 'student' && project.guide && (
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Guide:</span>
            <span className="ml-2">{project.guide.name}</span>
          </div>
        )}

        {role === 'teacher' && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{studentCount} student{studentCount !== 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Semester {project.semester}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <Link
        to={`/project/${project._id}`}
        className="flex items-center justify-center w-full btn-primary"
      >
        View Details
        <ArrowRight className="h-4 w-4 ml-2" />
      </Link>
    </div>
  );
};

export default ProjectCard;
