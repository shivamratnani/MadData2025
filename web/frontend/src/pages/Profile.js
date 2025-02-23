import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile update:', formData);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-mono p-8">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg flex items-center"
      >
        ← Back
      </button>
      <div className="max-w-2xl mx-auto bg-white dark:bg-dark-800 rounded-lg shadow p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 relative">
            <div className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{formData.name}</h2>
          <p className="text-gray-600">{formData.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 