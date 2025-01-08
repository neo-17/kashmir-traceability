import { ReactNode } from 'react';

interface DialogProps {
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
}

interface DialogHeaderProps {
  children: ReactNode;
}

interface DialogTitleProps {
  children: ReactNode;
}

interface DialogTrigger {
  children: ReactNode;
}

export const Dialog = ({ children }: DialogProps) => (
  <div className="dialog">{children}</div>
);

export const DialogTrigger = ({ children }: DialogProps) => (
  <button className="dialog-trigger">{children}</button>
);

export const DialogContent = ({ children }: DialogContentProps) => (
  <div className="dialog-content bg-white p-4 rounded shadow-lg">{children}</div>
);

export const DialogHeader = ({ children }: DialogHeaderProps) => (
  <div className="dialog-header mb-2">{children}</div>
);

export const DialogTitle = ({ children }: DialogTitleProps) => (
  <h2 className="text-lg font-bold">{children}</h2>
);
