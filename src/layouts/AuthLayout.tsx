import React from 'react';

export const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="auth-layout">{children}</div>;
};
