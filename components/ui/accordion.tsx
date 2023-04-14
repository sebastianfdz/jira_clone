import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import clsx from "clsx";
import "./styles.css";

type TriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>;
type TriggerRef = React.ElementRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = React.forwardRef<TriggerRef, TriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={forwardedRef}
        className={clsx("", className)}
        {...props}
      >
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);

AccordionTrigger.displayName = "AccordionTrigger";

type ContentProps = React.ComponentProps<typeof AccordionPrimitive.Content>;
type ContentRef = React.ElementRef<typeof AccordionPrimitive.Content>;

const AccordionContent = React.forwardRef<ContentRef, ContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Content
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="">{children}</div>
    </AccordionPrimitive.Content>
  )
);

AccordionContent.displayName = "AccordionContent";

type ItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;
type ItemRef = React.ElementRef<typeof AccordionPrimitive.Item>;

const AccordionItem = React.forwardRef<ItemRef, ItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Item
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AccordionPrimitive.Item>
  )
);
AccordionItem.displayName = "AccordionItem";

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;
type AccordionRef = React.ElementRef<typeof AccordionPrimitive.Root>;

const Accordion = React.forwardRef<AccordionRef, AccordionProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Root
      className={clsx("", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AccordionPrimitive.Root>
  )
);
Accordion.displayName = "Accordion";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
