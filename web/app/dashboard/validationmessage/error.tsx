"use client";

import React from 'react';

interface ErrorMessageProps {
  failed: boolean | null;
}

const FailedOperation: React.FC<ErrorMessageProps> = ({ failed }) => {
  return (
    failed && (
      <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
        <svg
          className="inline w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11.414l-3 3a1 1 0 001.414 1.414L9 10.414l4.293 4.293a1 1 0 001.414-1.414l-5-5a1 1 0 00-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">Failed!</span> Unable to register.
      </div>
    )
  );
};

export default FailedOperation;
