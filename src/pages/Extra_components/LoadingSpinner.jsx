import React from 'react';

const LoadingSpinner = ({container,spinner}) => {
    const styleForContainer="flex items-center justify-center z-50 "
    const styleForSpinner = "animate-spin rounded-full border-t-4 border-r-4 border-b-4 "
  return (
    <div className={styleForContainer+container}>
      <div className={styleForSpinner+spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
