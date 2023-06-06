import React from "react";
import * as AlertModalPrimitive from "@radix-ui/react-alert-dialog";
import clsx from "clsx";

type TriggerProps = React.ComponentProps<typeof AlertModalPrimitive.Trigger>;
type TriggerRef = React.ElementRef<typeof AlertModalPrimitive.Trigger>;

const ModalTrigger = React.forwardRef<TriggerRef, TriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AlertModalPrimitive.Trigger
      ref={forwardedRef}
      className={clsx("", className)}
      {...props}
    >
      {children}
    </AlertModalPrimitive.Trigger>
  )
);

ModalTrigger.displayName = "ModalTrigger";

type ContentProps = React.ComponentProps<typeof AlertModalPrimitive.Content>;
type ContentRef = React.ElementRef<typeof AlertModalPrimitive.Content>;

const ModalContent = React.forwardRef<ContentRef, ContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AlertModalPrimitive.Content
      className={clsx(
        "fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-[3px] bg-white p-8  shadow-md",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AlertModalPrimitive.Content>
  )
);

ModalContent.displayName = "ModalContent";

type PortalProps = React.ComponentProps<typeof AlertModalPrimitive.Portal>;

const ModalPortal: React.FC<PortalProps> = ({
  children,
  className,
  ...props
}) => (
  <AlertModalPrimitive.Portal className={clsx("", className)} {...props}>
    {children}
  </AlertModalPrimitive.Portal>
);

ModalPortal.displayName = "ModalPortal";

type OverlayProps = React.ComponentProps<typeof AlertModalPrimitive.Overlay>;
type OverlayRef = React.ElementRef<typeof AlertModalPrimitive.Overlay>;

const ModalOverlay = React.forwardRef<OverlayRef, OverlayProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AlertModalPrimitive.Overlay
      className={clsx("fixed inset-0 z-50 bg-black bg-opacity-40", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AlertModalPrimitive.Overlay>
  )
);
ModalOverlay.displayName = "ModalOverlay";

type TitleProps = React.ComponentProps<typeof AlertModalPrimitive.Title>;
type TitleRef = React.ElementRef<typeof AlertModalPrimitive.Title>;

const ModalTitle = React.forwardRef<TitleRef, TitleProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AlertModalPrimitive.Title
      className={clsx("text-2xl", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AlertModalPrimitive.Title>
  )
);
ModalTitle.displayName = "ModalTitle";

type DescriptionProps = React.ComponentProps<
  typeof AlertModalPrimitive.Description
>;
type DescriptionRef = React.ElementRef<typeof AlertModalPrimitive.Description>;

const ModalDescription = React.forwardRef<DescriptionRef, DescriptionProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AlertModalPrimitive.Description
      className={clsx("text-sm text-gray-500", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AlertModalPrimitive.Description>
  )
);
ModalDescription.displayName = "ModalDescription";

type CancelProps = React.ComponentProps<typeof AlertModalPrimitive.Cancel>;
type CancelRef = React.ElementRef<typeof AlertModalPrimitive.Cancel>;

const ModalCancel = React.forwardRef<CancelRef, CancelProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AlertModalPrimitive.Cancel
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AlertModalPrimitive.Cancel>
  )
);
ModalCancel.displayName = "ModalCancel";

type ActionProps = React.ComponentProps<typeof AlertModalPrimitive.Action>;
type ActionRef = React.ElementRef<typeof AlertModalPrimitive.Action>;

const ModalAction = React.forwardRef<ActionRef, ActionProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AlertModalPrimitive.Action
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AlertModalPrimitive.Action>
  )
);
ModalAction.displayName = "ModalAction";

const Modal = AlertModalPrimitive.Root;

export {
  Modal,
  ModalOverlay,
  ModalPortal,
  ModalTrigger,
  ModalContent,
  ModalCancel,
  ModalTitle,
  ModalDescription,
  ModalAction,
};
