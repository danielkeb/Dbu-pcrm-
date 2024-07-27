"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import ContactUsForm from "./ContactUsForm";

interface UserData {
  NumberOfstudent: number;
  totalNumberOfStaff: number;
  totalNumberOfGuest: number;
}

import { AcademicCapIcon, AnnotationIcon } from '@heroicons/react/solid';
import axios from "axios";

interface Props {
  window?: () => Window;
}

const navItems = [
  { name: "Home", href: "#Home" },
  { name: "About", href: "#About" },
  { name: "News", href: "#News" },
  { name: "Contact Us", href: "#ContactUs" }
];

export default function DrawerAppBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [data, setData] = React.useState<UserData>({
    NumberOfstudent: 0,
    totalNumberOfStaff: 0,
    totalNumberOfGuest: 0,
  });

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3333/pcuser/visualize");
      setData(response.data);
    } catch {
      throw new Error("unable to fetch pc owners")
    }
  }

  const featuresList = [
    {
      label: `${data.NumberOfstudent}`,
      title: "Students",
      icon: (
        <AnnotationIcon
          color="blue"
          style={{ width: 60, height: 60 }}
        />
      ),
    },
    {
      label: `${data.totalNumberOfStaff}`,
      title: "Staff",
      icon: (
        <AnnotationIcon
          color="blue"
          style={{ width: 60, height: 60 }}
        />
      ),
    },
    {
      label: `${data.totalNumberOfGuest}`,
      title: "Guests",
      icon: (
        <AnnotationIcon
          color="blue"
          style={{ width: 60, height: 60 }}
        />
      ),
    },
  ];

  const drawer = (
    <div className="text-center" onClick={handleDrawerToggle}>
      <h6 className="my-2">ABGSMS</h6>
      <hr className="border-t border-gray-300" />
      <ul>
        {navItems.map((item) => (
          <a key={item.name} href={item.href} className="text-black">
            <button>{item.name}</button>
          </a>
        ))}
        <button className="bg-blue-500 text-white w-full py-2">SignIn</button>
      </ul>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className="flex" id="Home">
      <header className="bg-white w-full fixed z-50 shadow-lg lg:pl-8 lg:pr-8">
        <nav className="flex justify-between items-center p-4">
          <div className="flex items-center justify-between w-full md:w-auto text-black">
            <b>DBU PMS</b>
            <button
              className="md:hidden text-black"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
            >
              <AcademicCapIcon />
            </button>
          </div>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className="text-black">
                <button>{item.name}</button>
              </a>
            ))}
            <Link href="/login">
              <button className="bg-blue-500 text-white py-2 px-4">
                SignIn
              </button>
            </Link>
          </div>
        </nav>
      </header>
      <nav className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
        {drawer}
      </nav>
      <main className="w-full pt-16 relative">
        <div
          style={{
            backgroundImage: 'url(/dbu_image.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        />
        <section className="hero h-screen flex items-center justify-center">
          <div className="flex flex-col md:flex-row items-center w-full h-full md:px-32 px-8">
            <div className="text-center md:text-left space-y-4 md:mr-12 w-full md:w-1/2" style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(0.5px)', padding: '50px'
            }}>
              <h2 className="text-blue-400 text-2xl font-medium">
                Welcome to
              </h2>
              <h1 className="text-white text-3xl md:text-4xl font-bold">
                DBU PC Management System.
              </h1>
              <p className="text-white max-w-md text-justify">
                The PC Management System at Debre Berhan University centralizes control of personal computers (PCs) for Students, Guests, and Staff. It offers one-time registration and easy use!
              </p>
              <div className="flex space-x-4 mt-5">
                <a href="/login">
                  <button className="bg-blue-400 px-6 py-3 text-gray-900 font-semibold rounded-full">
                    Get Started
                  </button>
                </a>
                <a href="#ContactUs">
                  <button className="border-2 border-blue-400 px-6 py-3 text-white font-semibold rounded-full">
                    Contact Us
                  </button>
                </a>
              </div>
            </div>
            {/* <div className="relative w-full md:w-1/2 md:h-1/2">
              <Image
                src="/pcsecurity.jpeg"
                fill
                style={{ objectFit: 'cover' }}
                alt="PC Security"
              />
            </div> */}
          </div>
        </section>

        <section className="py-20 px-8 md:px-32 space-y-16 rounded-tr-[20px] bg-gray-100" id="News">
          <div className="text-center space-y-2">
            <h2 className="text-blue-500 font-semibold">Our Features</h2>
            <h3 className="text-gray-700 text-3xl font-semibold">
              One-time registration, Easy use!
            </h3>
            <p className="max-w-md mx-auto">
              All registered students, guests, and staff are listed below. Please feel free to become a member of this opportunity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {featuresList.map((feature) => (
              <div
                className="bg-white p-6 flex flex-col items-center rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                key={feature.title}
              >
                <h1 className="text-gray-700 text-3xl font-bold">
                  {feature.label}
                </h1>
                <h4 className="text-gray-700 text-lg font-semibold">
                  {feature.title}
                </h4>
                <p className="text-center">
                  {feature.icon}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-32 py-10 space-y-8 md:space-y-0  bg-gray-100" id="About">
          <div
            className="bg-cover bg-no-repeat w-full md:w-1/2 h-80 md:h-[700px]"
            style={{
              backgroundImage:
                "url(https://media.licdn.com/dms/image/C560DAQH40kvOrMGfwA/learning-public-crop_288_512/0/1670879937797?e=2147483647&v=beta&t=tykcj4i-6UiglCOaoY1Iq6I8yxLp1SLRyi4G-ekP4cI)",
            }}
          />
          <div className="space-y-4 md:w-1/2 px-8">
            <h2 className="text-blue-600 text-lg font-semibold">ABOUT US</h2>
            <h3 className="text-gray-700 text-2xl font-medium">
              Debre Berhan University (DBU)
            </h3>
            <p className="text-gray-600 leading-7">
              Debre Berhan University (DBU) is a public higher education
              institution established as an autonomous in 2007 by the decree no. 61/1999 E.C of the
              Council of Ministers of the FDRE. Since its establishment, DBU has been striving hard
              to achieve its triple mandates of producing efficient graduates by offering research
              assisted quality education, undertaking problem solving research on some selected thematic
              areas and offering community engagement training, consultancy service, transferring
              technology and undertaking innovations.
            </p>

            <h5>Unique Initiatives</h5>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <AcademicCapIcon className="h-4 w-4 text-blue-500" />
                <span>Community engagement</span>
              </li>
              <li className="flex items-center space-x-2">
                <AcademicCapIcon className="h-4 w-4 text-blue-500" />
                <span>Innovation and Technology transfer</span>
              </li>
              <li className="flex items-center space-x-2">
                <AcademicCapIcon className="h-4 w-4 text-blue-500" />
                <span> Research and Publication</span>
              </li>
            </ul>
          </div>
        </section>
        <section className="py-20 px-8 md:px-32 space-y-16 rounded-tr-[20px] bg-gray-100" id="ContactUs">
          <ContactUsForm />
        </section>
        <footer className="w-full py-8 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between px-10  bg-gray-100">
          <span className="w-full text-center text-gray-700 mb-2">
            Copyright © 2024 Debre Birhan University . All rights reserved.
          </span>
        </footer>
      </main>
    </div>
  );
}
