import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

// Define the props interface, extending ButtonHTMLAttributes for accurate typings
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  // You can add more custom props here if needed
}

// Create the Button component with forwardRef for better ref handling
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = 'button',
      disabled = false,
      className,
      onTouchStart,
      ...rest
    },
    ref
  ) => {
    // Optionally handle onTouchStart if needed
    const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
      if (onTouchStart) {
        onTouchStart(event);
      }
      if (onTouchStart && typeof onTouchStart === 'function') {
        // You can add additional logic here if necessary
      }
    };

    return (
      <button
        type={type}
        disabled={disabled}
        onTouchStart={handleTouchStart}
        ref={ref}
        className={`${styles.button} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

// Set a display name for better debugging and React DevTools integration
Button.displayName = 'Button';

export default Button;
