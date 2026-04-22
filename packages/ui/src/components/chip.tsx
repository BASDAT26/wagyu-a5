import { cn } from "@wagyu-a5/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const chipVariants = cva(
  "group/chip inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
        secondary:
          "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
        outline: "border-border bg-background hover:bg-muted text-foreground",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
        success:
          "bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20 dark:text-green-400",
        warning:
          "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 hover:bg-yellow-500/20 dark:text-yellow-400",
      },
      size: {
        sm: "h-6 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        default: "h-7 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-8 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
      },
      removable: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      removable: false,
    },
  },
);

interface ChipProps
  extends React.ComponentProps<"div">, VariantProps<typeof chipVariants> {
  onRemove?: () => void;
  icon?: React.ReactNode;
  removableIcon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      removable = false,
      onRemove,
      icon,
      removableIcon,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="chip"
        data-variant={variant}
        data-size={size}
        data-removable={removable}
        className={cn(
          chipVariants({ variant, size, removable, className }),
          removable && "pr-1.5",
        )}
        role="status"
        {...props}
      >
        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        <span>{children}</span>
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-current/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
            aria-label="Remove chip"
            type="button"
          >
            {removableIcon ? (
              removableIcon
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3.5"
              >
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  },
);
Chip.displayName = "Chip";

// Role Chip - Non-clickable display chip for user roles
interface RoleChipProps extends React.ComponentProps<"div"> {
  role: string;
  icon?: React.ReactNode;
  variant?: "admin" | "user" | "moderator" | "guest";
}

const roleVariantStyles: Record<string, string> = {
  admin: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
  user: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  moderator:
    "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  guest: "bg-gray-500/10 text-gray-700 border-gray-500/20 dark:text-gray-400",
};

const RoleChip = React.forwardRef<HTMLDivElement, RoleChipProps>(
  ({ role, icon, variant = "user", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="role-chip"
        data-role={role}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium select-none",
          roleVariantStyles[variant],
          className,
        )}
        role="status"
        {...props}
      >
        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        <span>{role}</span>
      </div>
    );
  },
);
RoleChip.displayName = "RoleChip";

// Preference Chip - Clickable selection chip for preferences
interface PreferenceChipProps extends React.ComponentProps<"button"> {
  label: string;
  isSelected?: boolean;
  icon?: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
}

const preferenceVariantStyles = {
  default:
    "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:border-primary",
  secondary:
    "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20 data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-foreground data-[selected=true]:border-secondary",
  outline:
    "border-border bg-background text-foreground hover:bg-muted data-[selected=true]:bg-foreground data-[selected=true]:text-background data-[selected=true]:border-foreground",
};

const PreferenceChip = React.forwardRef<HTMLButtonElement, PreferenceChipProps>(
  (
    {
      label,
      isSelected = false,
      icon,
      variant = "default",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="preference-chip"
        data-selected={isSelected}
        className={cn(
          "group/preference-chip inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 cursor-pointer",
          preferenceVariantStyles[variant],
          className,
        )}
        {...props}
      >
        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        <span>{label}</span>
      </button>
    );
  },
);
PreferenceChip.displayName = "PreferenceChip";

export { Chip, chipVariants, PreferenceChip, RoleChip };
export type { ChipProps, PreferenceChipProps, RoleChipProps };
