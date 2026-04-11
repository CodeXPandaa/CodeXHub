import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wprAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Upload } from 'lucide-react';

const SubmitWPR = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weekNumber: '',
    progressDescription: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await wprAPI.submit(id, {
        weekNumber: parseInt(formData.weekNumber),
        progressDescription: formData.progressDescription,
      });
      toast.success('WPR submitted successfully!');
      navigate(`/project/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit WPR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/project/${id}`)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Project
      </button>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Submit Weekly Progress Report
        </h1>
        <p className="text-gray-600 mb-6">
          Document your progress for this week
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week Number
            </label>
            <input
              type="number"
              min="1"
              value={formData.weekNumber}
              onChange={(e) =>
                setFormData({ ...formData, weekNumber: e.target.value })
              }
              className="input-field"
              placeholder="Enter week number (e.g., 1, 2, 3...)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Description
            </label>
            <textarea
              value={formData.progressDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  progressDescription: e.target.value,
                })
              }
              className="input-field"
              rows={6}
              placeholder="Describe what you accomplished this week, challenges faced, and next steps..."
              required
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Attachment support coming soon
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For now, just describe your progress in detail
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/project/${id}`)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitWPR;
