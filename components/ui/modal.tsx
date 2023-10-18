import React from "react";
import * as ModalPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";

type TriggerProps = React.ComponentProps<typeof ModalPrimitive.Trigger>;
type TriggerRef = React.ElementRef<typeof ModalPrimitive.Trigger>;

const ModalTrigger = React.forwardRef<TriggerRef, TriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ModalPrimitive.Trigger
      ref={forwardedRef}
      className={clsx("", className)}
      {...props}
    >
      {children}
    </ModalPrimitive.Trigger>
  )
);

ModalTrigger.displayName = "ModalTrigger";

type ContentProps = React.ComponentProps<typeof ModalPrimitive.Content> & {
  customStyle?: boolean;
};
type ContentRef = React.ElementRef<typeof ModalPrimitive.Content>;

const ModalContent = React.forwardRef<ContentRef, ContentProps>(
  ({ children, className, customStyle = false, ...props }, forwardedRef) => (
    <div className="flex justify-center">
      <ModalPrimitive.Content
        className={clsx(
          customStyle ? "" : "top-20 bg-white p-8 shadow-md",
          "fixed z-50 rounded-[3px] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95  ",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
      </ModalPrimitive.Content>
    </div>
  )
);

ModalContent.displayName = "ModalContent";

type PortalProps = React.ComponentProps<typeof ModalPrimitive.Portal>;

const ModalPortal: React.FC<PortalProps> = ({
  children,
  className,
  ...props
}) => (
  <ModalPrimitive.Portal className={clsx("", className)} {...props}>
    {children}
  </ModalPrimitive.Portal>
);

ModalPortal.displayName = "ModalPortal";

type OverlayProps = React.ComponentProps<typeof ModalPrimitive.Overlay>;
type OverlayRef = React.ElementRef<typeof ModalPrimitive.Overlay>;

const ModalOverlay = React.forwardRef<OverlayRef, OverlayProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ModalPrimitive.Overlay
      className={clsx(
        "fixed inset-0 z-50 bg-black bg-opacity-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ModalPrimitive.Overlay>
  )
);
ModalOverlay.displayName = "ModalOverlay";

type TitleProps = React.ComponentProps<typeof ModalPrimitive.Title>;
type TitleRef = React.ElementRef<typeof ModalPrimitive.Title>;

const ModalTitle = React.forwardRef<TitleRef, TitleProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ModalPrimitive.Title
      className={clsx("text-2xl", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ModalPrimitive.Title>
  )
);
ModalTitle.displayName = "ModalTitle";

type DescriptionProps = React.ComponentProps<typeof ModalPrimitive.Description>;
type DescriptionRef = React.ElementRef<typeof ModalPrimitive.Description>;

const ModalDescription = React.forwardRef<DescriptionRef, DescriptionProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ModalPrimitive.Description
      className={clsx("text-sm text-gray-500", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ModalPrimitive.Description>
  )
);
ModalDescription.displayName = "ModalDescription";

type CloseProps = React.ComponentProps<typeof ModalPrimitive.Close>;
type CloseRef = React.ElementRef<typeof ModalPrimitive.Close>;

const ModalClose = React.forwardRef<CloseRef, CloseProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <ModalPrimitive.Close
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </ModalPrimitive.Close>
  )
);
ModalClose.displayName = "ModalClose";

const Modal = ModalPrimitive.Root;

export {
  Modal,
  ModalOverlay,
  ModalPortal,
  ModalTrigger,
  ModalContent,
  ModalClose,
  ModalTitle,
  ModalDescription,
};
