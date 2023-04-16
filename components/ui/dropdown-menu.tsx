import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

const Dropdown = DropdownMenuPrimitive.Root;

type DropdownTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Trigger
>;
type DropdownTriggerRef = React.ElementRef<
  typeof DropdownMenuPrimitive.Trigger
>;

const DropdownTrigger = React.forwardRef<
  DropdownTriggerRef,
  DropdownTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitive.Trigger
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </DropdownMenuPrimitive.Trigger>
));

DropdownTrigger.displayName = "DropdownTrigger";

type DropdownPortalProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Portal
>;

const DropdownPortal: React.FC<DropdownPortalProps> = ({
  children,
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.Portal className={clsx("", className)} {...props}>
    {children}
  </DropdownMenuPrimitive.Portal>
);

DropdownPortal.displayName = "DropdownPortal";

type DropdownContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Content
>;
type DropdownContentRef = React.ElementRef<
  typeof DropdownMenuPrimitive.Content
>;

const DropdownContent = React.forwardRef<
  DropdownContentRef,
  DropdownContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitive.Content
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </DropdownMenuPrimitive.Content>
));

DropdownContent.displayName = "DropdownContent";

type DropdownLabelProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
>;
type DropdownLabelRef = React.ElementRef<typeof DropdownMenuPrimitive.Label>;

const DropdownLabel = React.forwardRef<DropdownLabelRef, DropdownLabelProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <DropdownMenuPrimitive.Label
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  )
);

DropdownLabel.displayName = "DropdownLabel";

type DropdownItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
>;
type DropdownItemRef = React.ElementRef<typeof DropdownMenuPrimitive.Item>;

const DropdownItem = React.forwardRef<DropdownItemRef, DropdownItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <DropdownMenuPrimitive.Item
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
);

DropdownItem.displayName = "DropdownItem";

type DropdownGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Group
>;
type DropdownGroupRef = React.ElementRef<typeof DropdownMenuPrimitive.Group>;

const DropdownGroup = React.forwardRef<DropdownGroupRef, DropdownGroupProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <DropdownMenuPrimitive.Group
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </DropdownMenuPrimitive.Group>
  )
);

DropdownGroup.displayName = "DropdownGroup";

type DropdownSubProps = React.ComponentProps<typeof DropdownMenuPrimitive.Sub>;

const DropdownSub: React.FC<DropdownSubProps> = ({ children, ...props }) => (
  <DropdownMenuPrimitive.Sub {...props}>{children}</DropdownMenuPrimitive.Sub>
);

DropdownSub.displayName = "DropdownSub";

type DropdownSubTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
>;
type DropdownSubTriggerRef = React.ElementRef<
  typeof DropdownMenuPrimitive.SubTrigger
>;

const DropdownSubTrigger = React.forwardRef<
  DropdownSubTriggerRef,
  DropdownSubTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitive.SubTrigger
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownSubTrigger.displayName = "DropdownSubTrigger";

type DropdownSubContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
>;
type DropdownSubContentRef = React.ElementRef<
  typeof DropdownMenuPrimitive.SubContent
>;

const DropdownSubContent = React.forwardRef<
  DropdownSubContentRef,
  DropdownSubContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitive.SubContent
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </DropdownMenuPrimitive.SubContent>
));

DropdownSubContent.displayName = "DropdownSubContent";

type DropdownSeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>;
type DropdownSeparatorRef = React.ElementRef<
  typeof DropdownMenuPrimitive.Separator
>;

const DropdownSeparator = React.forwardRef<
  DropdownSeparatorRef,
  DropdownSeparatorProps
>(({ children, className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitive.Separator
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </DropdownMenuPrimitive.Separator>
));

DropdownSeparator.displayName = "DropdownSeparator";

export {
  Dropdown,
  DropdownTrigger,
  DropdownPortal,
  DropdownContent,
  DropdownLabel,
  DropdownItem,
  DropdownGroup,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
  DropdownSeparator,
};
