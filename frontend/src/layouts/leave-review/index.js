import React from 'react';
import Header from './header';

export default function MainLayout({ children }) {
  return (
    <div className="w-full h-full bg-[#F6F6F6] p-[15px] sm:p-[32px] min-h-[100vh] flex justify-center">
      <div className="w-full max-w-[768px] flex flex-col gap-[16px] min-h-full">
        <Header />
        
        <div className="flex-1 p-[24px] sm:p-[32px] bg-white rounded-[16px]">
          {children}
        </div>
      </div>
    </div>
  );
}