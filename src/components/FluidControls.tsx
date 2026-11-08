import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

export interface FluidSegmentedOption<T extends string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface FluidSegmentedControlProps<T extends string> {
  options: FluidSegmentedOption<T>[];
  value: T;
  onChange: (val: T) => void;
  layoutId: string;
  className?: string;
  buttonClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function FluidSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  className = "",
  buttonClassName = "",
  size = "md",
}: FluidSegmentedControlProps<T>) {
  const sizeStyles = {
    sm: "p-1 rounded-xl gap-1 text-xs",
    md: "p-1.5 rounded-full gap-1 text-xs",
    lg: "p-1.5 rounded-2xl gap-1.5 text-sm",
  };

  const buttonSizeStyles = {
    sm: "px-2.5 py-1 rounded-lg",
    md: "px-3.5 py-1.5 rounded-full",
    lg: "px-4 py-2 rounded-xl",
  };

  return (
    <div
      className={`inline-flex items-center bg-slate-200/70 border border-slate-300/40 relative overflow-x-auto scrollbar-none ${sizeStyles[size]} ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            whileHover={{ scale: isSelected ? 1 : 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`relative flex items-center justify-center gap-1.5 font-semibold whitespace-nowrap select-none transition-colors duration-200 cursor-pointer ${buttonSizeStyles[size]} ${
              isSelected
                ? "text-slate-900 font-bold"
                : "text-slate-600 hover:text-slate-900"
            } ${buttonClassName}`}
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-white shadow-sm shadow-slate-950/10 border border-slate-200/80 pointer-events-none"
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                  mass: 0.8,
                }}
              >
                {/* Subtle top specular sheen */}
                <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
              </motion.div>
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <span>{opt.label}</span>
              {opt.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                    isSelected
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-300/60 text-slate-600"
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

interface FluidToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export const FluidToggleSwitch: React.FC<FluidToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
}) => {
  const isSm = size === "sm";
  const trackWidth = isSm ? "w-9 h-5" : "w-11 h-6";
  const knobSize = isSm ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  const translateX = isSm ? (checked ? 16 : 2) : (checked ? 20 : 3);

  return (
    <label
      className={`inline-flex items-center gap-2.5 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"
      }`}
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          animate={{
            backgroundColor: checked ? "#4f46e5" : "#cbd5e1",
          }}
          transition={{ duration: 0.22 }}
          className={`${trackWidth} rounded-full p-0.5 shadow-inner transition-colors duration-200 border border-black/5`}
        >
          <motion.div
            animate={{
              x: translateX,
            }}
            whileTap={!disabled ? { scaleX: 1.25, scaleY: 0.88 } : undefined}
            transition={{
              type: "spring",
              stiffness: 550,
              damping: 30,
              mass: 0.7,
            }}
            className={`${knobSize} bg-white rounded-full shadow-md shadow-slate-900/20 top-0.5`}
          />
        </motion.div>
      </div>
      {label && (
        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
};

interface FluidCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  ariaLabel?: string;
}

export const FluidCheckbox: React.FC<FluidCheckboxProps> = ({
  id,
  checked,
  onChange,
  className = "",
  ariaLabel = "Toggle checkbox",
}) => {
  return (
    <motion.button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 600, damping: 28 }}
      className={`relative w-5 h-5 rounded-lg flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
        checked
          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs shadow-indigo-600/30"
          : "bg-white/80 border-slate-300 hover:border-slate-400 text-transparent"
      } ${className}`}
    >
      <motion.div
        initial={false}
        animate={{
          scale: checked ? 1 : 0.4,
          opacity: checked ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 25,
        }}
        className="flex items-center justify-center"
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </motion.div>
    </motion.button>
  );
};

interface FluidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
}

export const FluidButton: React.FC<FluidButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  onClick,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm border border-slate-800",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent",
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20 border border-emerald-600",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1.5 rounded-xl text-xs gap-1.5",
    md: "px-3.5 py-2 rounded-xl text-xs gap-2",
    lg: "px-5 py-2.5 rounded-2xl text-sm gap-2.5",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.96, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-semibold select-none cursor-pointer transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
