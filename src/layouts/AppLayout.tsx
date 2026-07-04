import React from 'react';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="app-layout">{children}</div>;
};
