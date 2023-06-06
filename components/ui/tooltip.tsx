import React, { type ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import clsx from "clsx";

const Tooltip = TooltipPrimitive.Root;

type TooltipTriggerProps = React.ComponentProps<
  typeof TooltipPrimitive.Trigger
>;
type TooltipTriggerRef = React.ElementRef<typeof TooltipPrimitive.Trigger>;

const TooltipTrigger = React.forwardRef<TooltipTriggerRef, TooltipTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <TooltipPrimitive.Trigger
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </TooltipPrimitive.Trigger>
  )
);

TooltipTrigger.displayName = "TooltipTrigger";

type TooltipPortalProps = React.ComponentProps<typeof TooltipPrimitive.Portal>;

const TooltipPortal: React.FC<TooltipPortalProps> = ({
  children,
  className,
  ...props
}) => (
  <TooltipPrimitive.Portal className={clsx("", className)} {...props}>
    {children}
  </TooltipPrimitive.Portal>
);

TooltipPortal.displayName = "TooltipPortal";

type TooltipContentProps = React.ComponentProps<
  typeof TooltipPrimitive.Content
>;
type TooltipContentRef = React.ElementRef<typeof TooltipPrimitive.Content>;

const TooltipContent = React.forwardRef<TooltipContentRef, TooltipContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <TooltipPrimitive.Content
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </TooltipPrimitive.Content>
  )
);

TooltipContent.displayName = "TooltipContent";

type TooltipArrowProps = React.ComponentProps<typeof TooltipPrimitive.Arrow>;

const TooltipArrow: React.FC<TooltipArrowProps> = ({ children, ...props }) => (
  <TooltipPrimitive.Arrow {...props}>{children}</TooltipPrimitive.Arrow>
);

TooltipArrow.displayName = "TooltipArrow";

const TooltipWrapper: React.FC<
  {
    children: ReactNode;
    text: string;
  } & TooltipContentProps
> = ({ children, text, side = "bottom" }) => {
  return (
    <TooltipPrimitive.Provider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side={side}
            sideOffset={4}
            className="z-50 max-w-2xl rounded-sm bg-gray-700 px-1.5 py-0.5 text-xs text-white"
          >
            {text}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipPrimitive.Provider>
  );
};

export {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
  TooltipArrow,
  TooltipWrapper,
};
