import React from "react";
import * as NavMenuPrimitive from "@radix-ui/react-navigation-menu";
import clsx from "clsx";

const NavigationMenu = NavMenuPrimitive.Root;

type NavigationMenuTriggerProps = React.ComponentProps<
  typeof NavMenuPrimitive.Trigger
>;
type NavigationMenuTriggerRef = React.ElementRef<
  typeof NavMenuPrimitive.Trigger
>;

const NavigationMenuTrigger = React.forwardRef<
  NavigationMenuTriggerRef,
  NavigationMenuTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.Trigger
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </NavMenuPrimitive.Trigger>
));

NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

type NavigationMenuListProps = React.ComponentProps<
  typeof NavMenuPrimitive.List
>;
type NavigationMenuListRef = React.ElementRef<typeof NavMenuPrimitive.List>;

const NavigationMenuList = React.forwardRef<
  NavigationMenuListRef,
  NavigationMenuListProps
>(({ children, className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.List
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </NavMenuPrimitive.List>
));

NavigationMenuList.displayName = "NavigationMenuList";

type NavigationMenuItemProps = React.ComponentProps<
  typeof NavMenuPrimitive.Item
>;
type NavigationMenuItemRef = React.ElementRef<typeof NavMenuPrimitive.Item>;

const NavigationMenuItem = React.forwardRef<
  NavigationMenuItemRef,
  NavigationMenuItemProps
>(({ children, className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.Item
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </NavMenuPrimitive.Item>
));

NavigationMenuItem.displayName = "NavigationMenuItem";

type NavigationMenuContentProps = React.ComponentProps<
  typeof NavMenuPrimitive.Content
>;
type NavigationMenuContentRef = React.ElementRef<
  typeof NavMenuPrimitive.Content
>;

const NavigationMenuContent = React.forwardRef<
  NavigationMenuContentRef,
  NavigationMenuContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.Content
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </NavMenuPrimitive.Content>
));

NavigationMenuContent.displayName = "NavigationMenuContent";

type NavigationMenuLinkProps = React.ComponentProps<
  typeof NavMenuPrimitive.Link
>;
type NavigationMenuLinkRef = React.ElementRef<typeof NavMenuPrimitive.Link>;

const NavigationMenuLink = React.forwardRef<
  NavigationMenuLinkRef,
  NavigationMenuLinkProps
>(({ children, className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.Link
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </NavMenuPrimitive.Link>
));

NavigationMenuLink.displayName = "NavigationMenuLink";

type NavigationMenuSubProps = React.ComponentProps<typeof NavMenuPrimitive.Sub>;
type NavigationMenuSubRef = React.ElementRef<typeof NavMenuPrimitive.Sub>;

const NavigationMenuSub = React.forwardRef<
  NavigationMenuSubRef,
  NavigationMenuSubProps
>(({ children, className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.Sub
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </NavMenuPrimitive.Sub>
));

NavigationMenuSub.displayName = "NavigationMenuSub";

type NavigationMenuViewportProps = React.ComponentProps<
  typeof NavMenuPrimitive.Viewport
>;
type NavigationMenuViewportRef = React.ElementRef<
  typeof NavMenuPrimitive.Viewport
>;

const NavigationMenuViewport = React.forwardRef<
  NavigationMenuViewportRef,
  NavigationMenuViewportProps
>(({ className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.Viewport
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  />
));

NavigationMenuViewport.displayName = "NavigationMenuViewport";

type NavigationMenuIndicatorProps = React.ComponentProps<
  typeof NavMenuPrimitive.Indicator
>;
type NavigationMenuIndicatorRef = React.ElementRef<
  typeof NavMenuPrimitive.Indicator
>;

const NavigationMenuIndicator = React.forwardRef<
  NavigationMenuIndicatorRef,
  NavigationMenuIndicatorProps
>(({ children, className, ...props }, forwardedRef) => (
  <NavMenuPrimitive.Indicator
    className={clsx("", className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </NavMenuPrimitive.Indicator>
));

NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
  NavigationMenu,
  NavigationMenuTrigger,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuSub,
  NavigationMenuViewport,
  NavigationMenuIndicator,
};
