"use client";

import { AppContext } from "@/components/UserContext"; // Correct the import path
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import useClient
import * as React from "react";
import { useContext, useEffect, useState } from "react";

type ListItemsProps = {
  isOpen: boolean; // Boolean value to determine if the sidebar is open
};

const MainListItems = ({ isOpen }: ListItemsProps) => {
  // Use useClient hook to ensure component runs on client side
  const path = usePathname();
  const { decodedToken } = useContext(AppContext);
  const [userRole, setUserRole] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const LIST_ITEMS = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "PC User",
      href: "/dashboard/pcuser",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Security",
      href: "/dashboard/security",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const hasAccess = (allowedRoles: string[]) =>
    allowedRoles.some((role) => role === userRole);

  useEffect(() => {
    setUserRole(decodedToken?.role || "");
  }, [decodedToken]);

  useEffect(() => {
    LIST_ITEMS.forEach((item, index) => {
      if (path.localeCompare(item.href) === 0) {
        setActiveIndex(index);
      }
    });
  }, [path]);

  return (
    <React.Fragment>
      {LIST_ITEMS.map((item, index) => {
        return (
          <Link key={index} href={item.href}>
            <div
              className={`${
                activeIndex === index && "bg-green-500"
              } flex items-center text-white py-3 gap-4 pl-4 w-full`}
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </div>
          </Link>
        );
      })}
    </React.Fragment>
  );
};

export default MainListItems;
