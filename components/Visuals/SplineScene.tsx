import React from 'react';

export const SplineScene: React.FC = () => {
  return (
    <div className="w-full h-[500px] lg:h-[600px] relative flex items-center justify-center">
      <iframe 
        src='https://my.spline.design/r4xbot-hrR7RkSvxNVQuUHHQA1I6KBS/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        className="pointer-events-auto"
        title="3D Robot Character"
      ></iframe>
    </div>
  );
};