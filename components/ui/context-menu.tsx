import React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import clsx from "clsx";

const Context = ContextMenuPrimitive.Root;

type ContextTriggerProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Trigger
>;
type ContextTriggerRef = React.ElementRef<typeof ContextMenuPrimitive.Trigger>;

const ContextTrigger = React.forwardRef<ContextTriggerRef, ContextTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ContextMenuPrimitive.Trigger
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ContextMenuPrimitive.Trigger>
  )
);

ContextTrigger.displayName = "ContextTrigger";

type ContextPortalProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Portal
>;

const ContextPortal: React.FC<ContextPortalProps> = ({
  children,
  className,
  ...props
}) => (
  <ContextMenuPrimitive.Portal className={clsx("", className)} {...props}>
    {children}
  </ContextMenuPrimitive.Portal>
);

ContextPortal.displayName = "ContextPortal";

type ContextContentProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Content
>;
type ContextContentRef = React.ElementRef<typeof ContextMenuPrimitive.Content>;

const ContextContent = React.forwardRef<ContextContentRef, ContextContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ContextMenuPrimitive.Content
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ContextMenuPrimitive.Content>
  )
);

ContextContent.displayName = "ContextContent";

type ContextLabelProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Label
>;
type ContextLabelRef = React.ElementRef<typeof ContextMenuPrimitive.Label>;

const ContextLabel = React.forwardRef<ContextLabelRef, ContextLabelProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ContextMenuPrimitive.Label
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ContextMenuPrimitive.Label>
  )
);

ContextLabel.displayName = "ContextLabel";

type ContextItemProps = React.ComponentProps<typeof ContextMenuPrimitive.Item>;
type ContextItemRef = React.ElementRef<typeof ContextMenuPrimitive.Item>;

const ContextItem = React.forwardRef<ContextItemRef, ContextItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ContextMenuPrimitive.Item
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ContextMenuPrimitive.Item>
  )
);

ContextItem.displayName = "ContextItem";

type ContextGroupProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Group
>;
type ContextGroupRef = React.ElementRef<typeof ContextMenuPrimitive.Group>;

const ContextGroup = React.forwardRef<ContextGroupRef, ContextGroupProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ContextMenuPrimitive.Group
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ContextMenuPrimitive.Group>
  )
);

ContextGroup.displayName = "ContextGroup";

type ContextSubProps = React.ComponentProps<typeof ContextMenuPrimitive.Sub>;

const ContextSub: React.FC<ContextSubProps> = ({ children, ...props }) => (
  <ContextMenuPrimitive.Sub {...props}>{children}</ContextMenuPrimitive.Sub>
);

ContextSub.displayName = "ContextSub";

type ContextSubTriggerProps = React.ComponentProps<
  typeof ContextMenuPrimitive.SubTrigger
>;
type ContextSubTriggerRef = React.ElementRef<
  typeof ContextMenuPrimitive.SubTrigger
>;

const ContextSubTrigger = React.forwardRef<
  ContextSubTriggerRef,
  ContextSubTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <ContextMenuPrimitive.SubTrigger
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </ContextMenuPrimitive.SubTrigger>
));

ContextSubTrigger.displayName = "ContextSubTrigger";

type ContextSubContentProps = React.ComponentProps<
  typeof ContextMenuPrimitive.SubContent
>;
type ContextSubContentRef = React.ElementRef<
  typeof ContextMenuPrimitive.SubContent
>;

const ContextSubContent = React.forwardRef<
  ContextSubContentRef,
  ContextSubContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <ContextMenuPrimitive.SubContent
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </ContextMenuPrimitive.SubContent>
));

ContextSubContent.displayName = "ContextSubContent";

type ContextSeparatorProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Separator
>;
type ContextSeparatorRef = React.ElementRef<
  typeof ContextMenuPrimitive.Separator
>;

const ContextSeparator = React.forwardRef<
  ContextSeparatorRef,
  ContextSeparatorProps
>(({ children, className, ...props }, forwardedRef) => (
  <ContextMenuPrimitive.Separator
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </ContextMenuPrimitive.Separator>
));

ContextSeparator.displayName = "ContextSeparator";

export {
  Context,
  ContextTrigger,
  ContextPortal,
  ContextContent,
  ContextLabel,
  ContextItem,
  ContextGroup,
  ContextSub,
  ContextSubTrigger,
  ContextSubContent,
  ContextSeparator,
};
