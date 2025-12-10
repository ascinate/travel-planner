"use client";
import { useState,useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import type { User } from "firebase/auth";
import ReactMarkdown from "react-markdown";

export default function Navbar() {
   const [user, setUser] = useState<User | null>(null);
    const menulist = [{ id: 1, title: 'Discover' , link: '/'}, { id: 2, title: 'Trips' , link: '/'}]; 
    const pathname = usePathname();
    const resultRef = useRef<HTMLDivElement>(null);


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



    const login = async () => {
      try {
        const res = await signInWithPopup(auth!, googleProvider);
        await setDoc(
          doc(db, "users", res.user.uid),
          { savedPlans: [] },
          { merge: true }
        );
      } catch (e) {
        console.error("Google login failed:", e);
        alert("Google sign-in failed. Please try again.");
      }
    };
  
    const logout = async () => {
      try {
        await signOut(auth!);
        setUser(null);
      } catch (e) {
        console.error("Logout failed:", e);
        alert("Logout failed. Please try again.");
      }
    };


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
                          <Link href="/signin" className="signup-btn2 flex items-center">Login <span className="ml-1"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg> </span></Link>
                            

                            
                              {!user ? (
                                <button
                                  onClick={login}
                                  className="signup-btn flex items-center"
                                >
                                  Sign in with Google
                                </button>
                              ) : (
                                <button
                                  onClick={logout}
                                  className="signup-btn flex items-center"
                                >
                                  Logout ({user.email})
                                </button>
                              )}
                        </div>
                </ul>
                
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden flex items-center text-gray-700 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
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

      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[999] 
    transform transition-transform duration-300 md:hidden
    ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

    <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">
          <Link className="navbar-brand" href="/">
                            <Image width={144} height={63} loading="lazy" src="/logo-svg.svg" alt="logos"/>
                        </Link>
        </h2>

        <button onClick={() => setIsMenuOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

        <nav className="p-4 space-y-3">
            {menulist.map((type) => (
                <Link 
                  key={type.id} 
                  href={type.link} 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-800 text-lg hover:text-blue-600"
                >
                    {type.title}
                </Link>
            ))}

              

               <Link href="/signin" className="signup-btn2 block p-0 flex items-center">Login <span className="ml-1"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg> </span></Link>
                {!user ? (
                  <button
                    onClick={login}
                    className="block signut-bg text-white py-2 px-4 rounded mt-2 text-center"
                  >
                    Sign in with Google
                  </button>
                ) : (
                  <button
                    onClick={logout}
                    className="block signut-bg text-white py-2 px-4 rounded mt-2 text-center"
                  >
                    Logout ({user.email})
                  </button>
                )}
           
        </nav>
      </div>

       </>
  );
}
