import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
}

interface AlertDescriptionProps {
  children: ReactNode;
}

export const Alert = ({ children }: AlertProps) => (
  <div className="alert bg-red-50 p-4 border-l-4 border-red-500 rounded">{children}</div>
);

export const AlertDescription = ({ children }: AlertDescriptionProps) => (
  <div className="text-sm text-red-800">{children}</div>
);
