import React, { useState } from 'react';
import { Upload, Loader } from 'lucide-react';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    highestQualification: '',
    institution: '',
    cgpa: '',
    graduationYear: '',
    class12Marks: '',
    class12Board: '',
    class12YearOfPassing: '',
    class10Marks: '',
    class10Board: '',
    class10YearOfPassing: '',
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('email', formData.email);
    formPayload.append('phone', formData.phone);
    formPayload.append('gender', formData.gender);
    formPayload.append('dateOfBirth', formData.dateOfBirth);
    formPayload.append('highestQualification', formData.highestQualification);
    formPayload.append('institution', formData.institution);
    formPayload.append('cgpa', formData.cgpa);
    formPayload.append('graduationYear', formData.graduationYear);
    formPayload.append('class12Marks', formData.class12Marks);
    formPayload.append('class12Board', formData.class12Board);
    formPayload.append('class12YearOfPassing', formData.class12YearOfPassing);
    formPayload.append('class10Marks', formData.class10Marks);
    formPayload.append('class10Board', formData.class10Board);
    formPayload.append('class10YearOfPassing', formData.class10YearOfPassing);

    if (formData.resume) {
      formPayload.append('resume', formData.resume);
    }

    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitted(true);
      } else {
        setIsSubmitting(false);
        alert('Error submitting application');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
      alert('Error submitting application');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600">
            Thank you for applying. We will review your application and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Internship Application</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.gender}
                  onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.dateOfBirth}
                  onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            </div>

            {/* Education Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
              {/* Highest Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Bachelor's in Computer Science"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.highestQualification}
                  onChange={e => setFormData(prev => ({ ...prev, highestQualification: e.target.value }))}
                />
              </div>
              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.institution}
                  onChange={e => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                />
              </div>
              {/* CGPA */}
              <div>
                <label className="block text-sm font-medium text-gray-700">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.cgpa}
                  onChange={e => setFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                />
              </div>
              {/* Year of Graduation */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Year of Graduation</label>
                <input
                  type="number"
                  required
                  min="2000"
                  max="2030"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.graduationYear}
                  onChange={e => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                />
              </div>
            </div>

            {/* Class 12 Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8">
              {/* Class 12 Marks */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Class 12 Marks (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.class12Marks}
                  onChange={e => setFormData(prev => ({ ...prev, class12Marks: e.target.value }))}
                />
              </div>
              {/* Class 12 Board */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Class 12 Board</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.class12Board}
                  onChange={e => setFormData(prev => ({ ...prev, class12Board: e.target.value }))}
                />
              </div>
              {/* Class 12 Year of Passing */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Class 12 Year of Passing</label>
                <input
                  type="number"
                  required
                  min="2000"
                  max="2030"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.class12YearOfPassing}
                  onChange={e => setFormData(prev => ({ ...prev, class12YearOfPassing: e.target.value }))}
                />
              </div>
            </div>

            {/* Class 10 Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8">
              {/* Class 10 Marks */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Class 10 Marks (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.class10Marks}
                  onChange={e => setFormData(prev => ({ ...prev, class10Marks: e.target.value }))}
                />
              </div>
              {/* Class 10 Board */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Class 10 Board</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.class10Board}
                  onChange={e => setFormData(prev => ({ ...prev, class10Board: e.target.value }))}
                />
              </div>
              {/* Class 10 Year of Passing */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Class 10 Year of Passing</label>
                <input
                  type="number"
                  required
                  min="2000"
                  max="2030"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.class10YearOfPassing}
                  onChange={e => setFormData(prev => ({ ...prev, class10YearOfPassing: e.target.value }))}
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700">Resume</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={e => setFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                  {formData.resume && (
                    <p className="text-xs text-green-600">Selected file: {formData.resume.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
