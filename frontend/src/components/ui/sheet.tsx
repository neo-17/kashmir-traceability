import * as React from "react";
import { createPortal } from "react-dom";

// ------------------------------------
// 1) Context for Sheet State
// ------------------------------------
interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(
  undefined
);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a <Sheet> parent.");
  }
  return context;
}

// ------------------------------------
// 2) Main <Sheet> component
// ------------------------------------
interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * Manages the "open" state context for the sheet.
 */
export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const value = React.useMemo<SheetContextValue>(
    () => ({
      open,
      setOpen: onOpenChange,
    }),
    [open, onOpenChange]
  );

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
}

// ------------------------------------
// 3) <SheetTrigger> for toggling open state
// ------------------------------------
interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

/**
 * Renders a button (or wraps an existing element if "asChild" is true)
 * that toggles the sheet open/closed.
 */
export function SheetTrigger({ asChild, children }: SheetTriggerProps) {
  const { open, setOpen } = useSheet();

  const handleClick = () => {
    setOpen(!open);
  };

  // If "asChild", clone the child element to pass our click handler
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    });
  }

  // Otherwise, render a simple button
  return <button onClick={handleClick}>{children}</button>;
}

// ------------------------------------
// 4) <SheetContent> for the drawer UI
// ------------------------------------
interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right" | "top" | "bottom";
  // ...Add any other props your design might need
}

/**
 * Renders the sheet content in a portal if open = true.
 * For a minimal approach, we just show/hide instantly.
 *
 * If you want transitions or a backdrop, add them here.
 */
export function SheetContent({
  side = "right",
  className = "",
  children,
  ...props
}: SheetContentProps) {
  const { open } = useSheet();

  // If the sheet is not open, return null to hide it.
  if (!open) return null;

  // For more advanced usage, you might want to handle different "side" logic.
  // For now, we're just rendering a fixed div. Adjust as you like.
  return createPortal(
    <div
      className={`fixed inset-0 flex justify-${side} ${className}`}
      {...props}
    >
      {/* 
        A simple panel. Customize styling, width, etc.
        You could also add a backdrop here if desired. 
      */}
      <div className="bg-white shadow-lg min-w-[16rem] max-w-xs h-full">
        {children}
      </div>
    </div>,
    document.body
  );
}
