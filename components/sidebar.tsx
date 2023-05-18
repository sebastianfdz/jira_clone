"use client";
import { useState } from "react";
import Link from "next/link";
import { BacklogIcon, BoardIcon, DevelopmentIcon, RoadmapIcon } from "./icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { usePathname } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";

type NavItem = {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  href: string;
};

const NavList: React.FC<{ items: NavItem[]; label: string }> = ({
  items,
  label,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const currentPath = usePathname();
  return (
    <div className="flex flex-col gap-y-2">
      <div className="group flex items-center gap-x-1">
        <button
          data-state={isVisible ? "open" : "closed"}
          onClick={() => setIsVisible(!isVisible)}
          className="invisible group-hover:visible [&[data-state=open]>svg]:rotate-90"
        >
          <FaChevronRight className="text-xs transition-transform" />
        </button>
        <span className="text-xs font-bold text-gray-700">{label}</span>
      </div>
      <NavigationMenu
        data-state={isVisible ? "open" : "closed"}
        className="hidden [&[data-state=open]]:block"
      >
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem
              key={item.id}
              className="w-full rounded-lg text-gray-600"
            >
              <Link href={item.href} passHref legacyBehavior>
                <NavigationMenuLink
                  active={currentPath === item.href}
                  className="flex w-full rounded-sm border-transparent py-2 [&[data-active]]:border-l-blue-700 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700"
                >
                  <div className="flex w-full items-center gap-x-3 border-l-4 border-inherit bg-inherit px-2">
                    <item.icon />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const Sidebar = () => {
  const planningItems = [
    {
      id: "roadmap",
      label: "Roadmap",
      icon: RoadmapIcon,
      href: `/project/roadmap`,
    },
    {
      id: "backlog",
      label: "Backlog",
      icon: BacklogIcon,
      href: `/project/backlog`,
    },
    {
      id: "board",
      label: "Board",
      icon: BoardIcon,
      href: `/project/board`,
    },
  ];

  const developmentItems = [
    {
      id: "development",
      label: "Development",
      icon: DevelopmentIcon,
      href: `/project/`,
    },
  ];
  return (
    <div className="flex h-full w-64 flex-col gap-y-5 bg-gray-50 p-3 shadow-inner">
      <div className="my-5 flex items-center gap-x-2 px-3">
        <div className="flex aspect-square items-center justify-center rounded-sm bg-orange-500 p-3 text-xs font-bold text-white"></div>
        <div>
          <h2 className="text-sm font-semibold text-gray-600">Project Name</h2>
          <p className="text-xs text-gray-500">Project Type</p>
        </div>
      </div>
      <NavList label={"PLANNING"} items={planningItems} />
      <NavList label={"DEVELOPMENT"} items={developmentItems} />
    </div>
  );
};

export { Sidebar };
