import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import clsx from "clsx";
import { RxChevronDown } from "react-icons/rx";
import "./styles.css";

type TriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={clsx(
          "flex h-48 flex-1 items-center justify-between bg-blue-500 p-2",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <div className="text-black">hola</div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);

AccordionTrigger.displayName = "AccordionTrigger";

type ContentProps = React.ComponentProps<typeof AccordionPrimitive.Content>;

const AccordionContent = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Content
      className={clsx("AccordionContent", className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="AccordionContentText">{children}</div>
    </AccordionPrimitive.Content>
  )
);

AccordionContent.displayName = "AccordionContent";

type ItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;

const AccordionItem = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitive.Item
      className={clsx("AccordionItem", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AccordionPrimitive.Item>
  )
);

AccordionItem.displayName = "AccordionItem";

const Accordion = AccordionPrimitive.Root;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
