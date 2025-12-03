"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


export default function Navbar() {
    const menulist = [{ id: 1, title: 'Discover' , link: '/discover'}, { id: 2, title: 'Trips' , link: '/trips'},{ id: 3, title: 'Review' , link: '/review'}, {id:4, title: 'Contact' , link: '/pricing'} ]; 
    const pathname = usePathname();
  return (
       <>
       <header className="shadow float-left w-full navications-div">
        <nav className="inside01">
          <div className="container">

            <div className="flex justify-between h-16">
              
              <div className="flex items-center">
                    <Link className="navbar-brand" href="/">
                        <Image width={144} height={63} loading="lazy" src="/logo-svg.svg" alt="logos"/>
                    </Link>
              </div>

             
              <ul className="hidden md:flex space-x-6 items-center justify-center menu-sections01">
                    {menulist.map((type) => (
                        <li className="nav-item" key={type.id}>
                            <Link className={`nav-link ${pathname === type.link ? "active" : ""}`} href={type.link}>
                              {type.title}
                            </Link>
                        </li>
                      ))}
                </ul>
              <div className="right-logins ml-auto flex items-center">
                <Link href="/" className="login-ins flex items-center mr-3"> <span className="mr-2"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M11.9999 17C15.6623 17 18.8649 18.5751 20.607 20.9247L18.765 21.796C17.3473 20.1157 14.8473 19 11.9999 19C9.15248 19 6.65252 20.1157 5.23479 21.796L3.39355 20.9238C5.13576 18.5747 8.33796 17 11.9999 17ZM11.9999 2C14.7613 2 16.9999 4.23858 16.9999 7V10C16.9999 12.6888 14.8776 14.8818 12.2168 14.9954L11.9999 15C9.23847 15 6.9999 12.7614 6.9999 10V7C6.9999 4.31125 9.1222 2.11818 11.783 2.00462L11.9999 2ZM11.9999 4C10.4022 4 9.09623 5.24892 9.00499 6.82373L8.9999 7V10C8.9999 11.6569 10.343 13 11.9999 13C13.5976 13 14.9036 11.7511 14.9948 10.1763L14.9999 10V7C14.9999 5.34315 13.6567 4 11.9999 4Z"></path></svg></span> Log in</Link>
                <Link href="/" className="signup-btn flex items-center">Sign up <span className="ml-1"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg> </span></Link>
              </div>
              <button id="menu-btn" className="md:hidden  flex items-center text-gray-700 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div id="mobile-menu" className="hidden md:hidden">
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About</Link>
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Services</Link>
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact</Link>
          </div>
        


        </nav>
      </header>
       </>
  );
}
