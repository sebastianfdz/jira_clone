import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

const Popover = PopoverPrimitive.Root;

type PopoverTriggerProps = React.ComponentProps<
  typeof PopoverPrimitive.Trigger
>;
type PopoverTriggerRef = React.ElementRef<typeof PopoverPrimitive.Trigger>;

const PopoverTrigger = React.forwardRef<PopoverTriggerRef, PopoverTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <PopoverPrimitive.Trigger
      className={className}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </PopoverPrimitive.Trigger>
  )
);

PopoverTrigger.displayName = "PopoverTrigger";

type PopoverAnchorProps = React.ComponentProps<typeof PopoverPrimitive.Anchor>;
type PopoverAnchorRef = React.ElementRef<typeof PopoverPrimitive.Anchor>;

const PopoverAnchor = React.forwardRef<PopoverAnchorRef, PopoverAnchorProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <PopoverPrimitive.Anchor
      className={className}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </PopoverPrimitive.Anchor>
  )
);

PopoverAnchor.displayName = "PopoverAnchor";

type PopoverPortalProps = React.ComponentProps<typeof PopoverPrimitive.Portal>;

const PopoverPortal: React.FC<PopoverPortalProps> = ({
  children,
  className,
  ...props
}) => (
  <PopoverPrimitive.Portal className={className} {...props}>
    {children}
  </PopoverPrimitive.Portal>
);

PopoverPortal.displayName = "PopoverPortal";

type PopoverContentProps = React.ComponentProps<
  typeof PopoverPrimitive.Content
>;
type PopoverContentRef = React.ElementRef<typeof PopoverPrimitive.Content>;

const PopoverContent = React.forwardRef<PopoverContentRef, PopoverContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <PopoverPrimitive.Content
      className={className}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </PopoverPrimitive.Content>
  )
);

PopoverContent.displayName = "PopoverContent";

type PopoverCloseProps = React.ComponentProps<typeof PopoverPrimitive.Close>;
type PopoverCloseRef = React.ElementRef<typeof PopoverPrimitive.Close>;

const PopoverClose = React.forwardRef<PopoverCloseRef, PopoverCloseProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <PopoverPrimitive.Close className={className} {...props} ref={forwardedRef}>
      {children}
    </PopoverPrimitive.Close>
  )
);

PopoverClose.displayName = "PopoverClose";

type PopoverArrowProps = React.ComponentProps<typeof PopoverPrimitive.Arrow>;
type PopoverArrowRef = React.ElementRef<typeof PopoverPrimitive.Arrow>;

const PopoverArrow = React.forwardRef<PopoverArrowRef, PopoverArrowProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <PopoverPrimitive.Arrow className={className} {...props} ref={forwardedRef}>
      {children}
    </PopoverPrimitive.Arrow>
  )
);

PopoverArrow.displayName = "PopoverArrow";

export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  PopoverArrow,
};
