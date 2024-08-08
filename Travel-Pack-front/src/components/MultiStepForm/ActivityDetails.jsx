// src/components/ActivityDetails.js
import React from 'react';

const ActivityDetails = ({ nextStep, prevStep }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Activity Details</h2>
      <form className="space-y-4">
        {/* Add your activity details form fields here */}
        <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={prevStep}>Back</button>
        <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={nextStep}>Next</button>
      </form>
    </div>
  );
};

export default ActivityDetails;
