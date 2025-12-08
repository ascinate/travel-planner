"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Navbar() {
    const menulist = [{ id: 1, title: 'Discover' , link: '/discover'}, { id: 2, title: 'Trips' , link: '/trips'}]; 
    const pathname = usePathname();


  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
       <>
       <header className="float-left w-full navications-div">
        <div className={`w-full mainmenu  block top-0 left-0 z-50 transition-all duration-300 
           ${isSticky ? "fixed bg-white shadow-md py-2" : "relative bg-transparent pt-3"}`}>
          <nav className="inside01">
            <div className="container">

              <div className="flex justify-between h-16">
                
                <div className="flex items-center">
                      <Link className="navbar-brand" href="/">
                          <Image width={202} height={48} loading="lazy" src="/logo-svg.svg" alt="logos"/>
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
                        <div className="right-logins ml-auto flex items-center">
                            <Link href="/" className="signup-btn flex items-center">Sign up <span className="ml-1"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg> </span></Link>
                        </div>
                </ul>
                
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
        </div>
      </header>

       </>
  );
}
