import React from 'react';

interface CallToActionBannerProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const CallToActionBanner: React.FC<CallToActionBannerProps> = ({ title, description, buttonText, onClick }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 opacity-90 max-w-2xl">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-slate-100 transition-all transform hover:scale-105 shadow-md flex-shrink-0"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CallToActionBanner;
