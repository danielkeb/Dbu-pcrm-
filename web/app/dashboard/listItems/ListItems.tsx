"use client";
import { AppContext } from "@/components/UserContext"; // Correct import path for AppContext
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useContext, useEffect, useMemo, useState } from "react";

type ListItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

type ListItemsProps = {
  isOpen: boolean;
};

const MainListItems = ({ isOpen }: ListItemsProps) => {
  const path = usePathname();
  const router = useRouter();
  const { decodedToken, token } = useContext(AppContext);
  const [userRole, setUserRole] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Memoize LIST_ITEMS initialization to prevent unnecessary re-renders
  const LIST_ITEMS: ListItem[] = useMemo(() => {
    const adminItems: ListItem[] = [
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
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ];

    const securityItems: ListItem[] = [
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
        name: "Pc user",
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
              d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "Task",
        href: "/dashboard/task",
        icon: (
          <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
        ),
      },
      {
        name: "Manage",
        href: "/dashboard/pcuser/manage",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "Tired user",
        href: "/dashboard/tired",
        icon: (
          <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" />
            </svg>

        ),
      },
    ];

    return userRole === "admin" ? adminItems : securityItems;
  }, [userRole]);

  useEffect(() => {
    setUserRole(decodedToken?.role || "");
  }, [decodedToken]);

  useEffect(() => {
    LIST_ITEMS.forEach((item, index) => {
      if (path.localeCompare(item.href) === 0) {
        setActiveIndex(index);
      }
    });
  }, [LIST_ITEMS, path]); // Include LIST_ITEMS and path in the dependency array

  // Function to check if user is authenticated
  const isAuthenticated = useMemo(() => {
    return !!decodedToken; // Check if decodedToken exists (assuming it indicates authentication)
  }, [decodedToken]);

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!token && !storedToken) {
      router.push("/login"); // Replace with your actual login page route
    }
  }, [token, router]);

  // Redirect to unauthorized page if user tries to access restricted routes
  useEffect(() => {
    if (
      (isAuthenticated && userRole !== "admin" && path === "/dashboard/security") ||
      (isAuthenticated && userRole !== "security" && (path === "/dashboard/pcuser" || path === "/dashboard/pcuser/manage"))
    ) 
    {
      router.push("/dashboard");
    }
  }, [isAuthenticated, userRole, path, router]);

  return (
    <React.Fragment>
      {LIST_ITEMS.map((item, index) => (
        <Link key={index} href={item.href}>
          <div
            className={`${
              activeIndex === index && "bg-blue-500"
            } flex items-center text-white py-3 gap-4 pl-4 w-full cursor-pointer`}
          >
            {item.icon}
            {isOpen && <span className="ml-2">{item.name}</span>}
          </div>
        </Link>
      ))}
    </React.Fragment>
  );
};

export default MainListItems;
