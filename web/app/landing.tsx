"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { AcademicCapIcon, AnnotationIcon, ArchiveIcon } from '@heroicons/react/solid';
interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ["Home", "About", "News", "Contact Us"];

export default function DrawerAppBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const featuresList = [
    {
      icon: (
        <AnnotationIcon
          color="blue"
          style={{ width: 60, height: 60 }}
        />
      ),
      title: "Students pcowner",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores laudantium vero quod sapiente adipisci sint perferendis ut praesentium repellat amet!",
    },
    {
      icon: (
        <ArchiveIcon
          color="blue"
          style={{ width: 60, height: 60 }}
        />
      ),
      title: "Staff",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores laudantium vero quod sapiente adipisci sint perferendis ut praesentium repellat amet!",
    },
    {
      icon: <AcademicCapIcon color="blue" style={{ width: 60, height: 60 }} />,
      title: "Guest PcOwner",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores laudantium vero quod sapiente adipisci sint perferendis ut praesentium repellat amet!",
    },
  ];

  const drawer = (
    <div className="text-center" onClick={handleDrawerToggle}>
      <h6 className="my-2">ABGSMS</h6>
      <hr className="border-t border-gray-300" />
      <ul>
        {navItems.map((item) => (
          <li key={item} className="py-2">
            <button className="w-full text-center">{item}</button>
          </li>
        ))}
        <button className="bg-blue-500 text-white w-full py-2">Portal</button>
      </ul>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className="flex">
      <header className="bg-white w-full fixed z-50 shadow-lg lg:pl-8 lg:pr-8">
        <nav className="flex justify-between items-center p-4">
          <div className="flex items-center justify-between w-full md:w-auto text-black">
            <b>AGSMS</b>
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
              <button key={item} className="text-black">
                {item}
              </button>
            ))}
            <Link href="/login">
              <button className="bg-blue-500 text-white py-2 px-4">
                Portal
              </button>
            </Link>

            <Link href="/dashboard">
              <button className="bg-blue-500 text-white py-2 px-4">
                SignUp
              </button>
            </Link>
          </div>
        </nav>
      </header>
      <nav className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
        {drawer}
      </nav>
      <main className="w-full pt-16">
        <section className="hero h-screen flex items-center justify-center bg-[#141b2b]">
          <div className="flex flex-col md:flex-row items-center md:px-32 px-8">
            <div className="text-center md:text-left space-y-4 mr-12">
              <h2 className="text-blue-400 text-2xl font-medium">
                Welcome To Our Website!
              </h2>
              <h1 className="text-white text-3xl md:text-4xl font-bold">
                Dbu  Pc Management System.
              </h1>
              <p className="text-white max-w-md text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam nulla ipsa unde inventore minus commodi saepe? Eos
                cumque aliquam consequatur id optio dolorum modi quod?
              </p>
              <div className="flex space-x-4 mt-5">
                <button className="bg-blue-400 px-6 py-3 text-gray-900 font-semibold rounded-full">
                  Get Started
                </button>
                <button className="border-2 border-blue-400 px-6 py-3 text-white font-semibold rounded-full">
                  Contact Us
                </button>
              </div>
            </div>
            {/* <img src="/pcsecurity.jpeg" className="md:w-1/2 w-full" alt="" /> */}
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <Image
        src="/pcsecurity.jpeg"
        fill
        style={{ objectFit: 'cover' }}
        alt="PC Security"
      />
    </div>
          </div>
        </section>
        <section className="py-20 px-8 md:px-32 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-blue-500 font-semibold">Our Features</h2>
            <h3 className="text-gray-700 text-3xl font-semibold">
              Our Priceless Features
            </h3>
            <p className="max-w-md mx-auto">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
              animi et quidem quis quas nisi.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {featuresList.map((feature) => (
              <div
                className="bg-white p-6 flex flex-col items-center rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                key={feature.title}
              >
                {feature.icon}
                <h4 className="text-gray-700 text-lg font-semibold">
                  {feature.title}
                </h4>
                <p className="text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-32 py-10 space-y-8 md:space-y-0">
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
              We Are Here To Bring You All The Comfort And Pleasure
            </h3>
            <p className="text-gray-600 leading-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur dignissimos ratione, excepturi explicabo non quasi
              velit pariatur ipsa mollitia voluptate nemo similique recusandae,
              doloribus porro expedita eius. Magnam, laudantium velit.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <AcademicCapIcon color="blue" />
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
              </li>
              <li className="flex items-center space-x-2">
                <AcademicCapIcon color="blue" />
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
              </li>
              <li className="flex items-center space-x-2">
                <AcademicCapIcon color="blue" />
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
              </li>
            </ul>
            <button className="bg-blue-700 px-6 py-3 text-white font-semibold rounded-full mt-6 shadow-md">
              Discover More
            </button>
          </div>
        </section>
        <section className="w-full py-10">
          <div className="map-responsive">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.0512916444013!2d39.53042267585995!3d9.67665879041285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1649bd79fe92a5f5%3A0xcedc88541b6c788d!2sAbune%20Gorgoriwos%20Scoll!5e0!3m2!1sen!2set!4v1707652781042!5m2!1sen!2set"
              width="600"
              height="450"
              allowFullScreen
              loading="lazy"
              title="Responsive google map"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
        <footer className="w-full py-8 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between px-10">
          <span className="text-gray-700">
            Copyright © 2024 AbuneGorgorious Schools . All rights reserved.
          </span>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600"
            >
              Terms and conditions
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600"
            >
              Long Term Contracts
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600"
            >
              Copyright Policy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600"
            >
              Customer Support
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
