import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

/**
 * A minimal label component. You may customize this style as desired.
 */
export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium leading-none ${className}`}
      {...props}
    />
  );
}
