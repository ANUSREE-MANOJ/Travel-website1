// src/components/MultiStepForm.js
import React, { useState } from 'react';
import ContactDetails from './ContactDetails';
// import ActivityDetails from './ActivityDetails';
import PaymentDetails from './PaymentDetails';
import { useParams } from 'react-router';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);

   const {id} = useParams()
   console.log(id)
  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

 
  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ContactDetails nextStep={nextStep} id={id}/>;
    
      case 2:
        return <PaymentDetails prevStep={prevStep} id={id}/>;
      default:
        return <ContactDetails nextStep={nextStep} />;
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="steps flex justify-center space-x-10 mb-8">
        <div className={`step ${step === 1 ? 'text-blue-500' : ''}`}>1. Contact Details</div>
        <div className={`step ${step === 2 ? 'text-blue-500' : ''}`}>2. Payment Details</div>
      </div>
      {renderStep()}
    </div>
  );
};

export default MultiStepForm;
