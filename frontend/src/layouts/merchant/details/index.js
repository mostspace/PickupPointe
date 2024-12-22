import React from 'react';

export default function DetailsLayout({ children }) {
  return (
    <div className="w-full h-full bg-[#F6F6F6] p-[15px] sm:p-[32px] min-h-[100vh] flex justify-center">
      <div className="w-full max-w-[960px] flex flex-1 flex-col gap-[16px] min-h-full">
        {children}
      </div>
    </div>
  );
}