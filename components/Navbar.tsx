"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Navbar() {
    const menulist = [{ id: 1, title: 'Discover' , link: '/discover'}, { id: 2, title: 'Trips' , link: '/trips'},{ id: 3, title: 'Review' , link: '/review'}, {id:4, title: 'About' , link: '/about'}, {id:4, title: 'Contact' , link: '/pricing'} ]; 
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
       <header className="shadow float-left w-full navications-div">
        <div className="tops-sec-head block w-full">
            <div className="container">
               <div className="grid grid-cols-3 items-center">
                  <div className="lefts-top-head01">
                     <Link href="/" className="bt-links01 flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"></path></svg>
                      exmaple@gmail.com </Link>
                  </div>
                  <div className="lefts-top-head01">
                     <p className="text-center text-white"> Your guide to accessible Your Next Trip ! <Link href="/" className="bt-links01 list-gh01"> Search Your Tour </Link> </p>
                  </div>
                  <div className="lefts-top-head01">
                      <ul className="flex items-center ml-auto justify-end">
                         <li>
                           <Link href="/" className="soclins"> <svg width="19" height="19" viewBox="0 0 73 136" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
<path d="M23.0805 24.5077V51.1005H0V74.6825H23.0805V135.896H48.168V74.6825H72.252V51.1005H48.168V33.5391C47.3652 23.9055 53.1855 22.1661 56.196 22.5006H72.252V1.33165C30.6067 -5.19014 23.5822 13.8038 23.0805 24.5077Z" fill="#ffffff"/>
</svg></Link>
                         </li>
                         <li>

                          <Link href="/" className="soclins"> <svg width="18" height="18" viewBox="0 0 132 141" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
<path d="M37.9536 3H5.76389C4.16112 3 3.20945 4.79098 4.10641 6.11926L92.9173 137.637C93.2825 138.178 93.8887 138.507 94.5413 138.517L129.599 139.105C131.228 139.132 132.205 137.303 131.276 135.965L39.5967 3.85972C39.223 3.3212 38.6091 3 37.9536 3Z" fill="#ffffff"/>
<path d="M120.762 1.50296C121.865 0.266695 123.761 0.158735 124.997 1.26175C126.233 2.36479 126.341 4.2608 125.238 5.49711L5.23832 139.997C4.13528 141.233 2.23927 141.341 1.00296 140.238C-0.233305 139.135 -0.341265 137.239 0.761754 136.003L120.762 1.50296Z" fill="#ffffff"/>
</svg>                    </Link>
                         </li>
                         <li>
                          <Link href="/" className="soclins"> <svg width="19" height="19" viewBox="0 0 128 128" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M98 10H30C18.9543 10 10 18.9543 10 30V98C10 109.046 18.9543 118 30 118H98C109.046 118 118 109.046 118 98V30C118 18.9543 109.046 10 98 10ZM30 0C13.4315 0 0 13.4315 0 30V98C0 114.569 13.4315 128 30 128H98C114.569 128 128 114.569 128 98V30C128 13.4315 114.569 0 98 0H30Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M64.3907 88.3414C77.6186 88.3414 88.3419 77.6181 88.3419 64.3902C88.3419 51.1623 77.6186 40.439 64.3907 40.439C51.1628 40.439 40.4395 51.1623 40.4395 64.3902C40.4395 77.6181 51.1628 88.3414 64.3907 88.3414ZM64.3907 98.3414C83.1414 98.3414 98.3419 83.1409 98.3419 64.3902C98.3419 45.6394 83.1414 30.439 64.3907 30.439C45.6399 30.439 30.4395 45.6394 30.4395 64.3902C30.4395 83.1409 45.6399 98.3414 64.3907 98.3414Z" fill="#ffffff"/>
<path d="M110 28.5C110 33.1944 106.194 37 101.5 37C96.8056 37 93 33.1944 93 28.5C93 23.8056 96.8056 20 101.5 20C106.194 20 110 23.8056 110 28.5Z" fill="#ffffff"/>
</svg> </Link>
                         </li>
                      </ul>
                  </div>
               </div>
            </div>
        </div>
        <div className={`w-full mainmenu  block top-0 left-0 z-50 transition-all duration-300 
           ${isSticky ? "fixed bg-white shadow-md py-2" : "relative bg-transparent pt-3"}`}>
            <nav className="inside01">
              <div className="container">

                <div className="flex justify-between h-16">
                  
                  <div className="flex items-center logos-mains">
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
                    <Link href="/" className="login-ins flex items-center mr-3"> <span className="mr-2"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(0, 0, 0, 1)"><path d="M11.9999 17C15.6623 17 18.8649 18.5751 20.607 20.9247L18.765 21.796C17.3473 20.1157 14.8473 19 11.9999 19C9.15248 19 6.65252 20.1157 5.23479 21.796L3.39355 20.9238C5.13576 18.5747 8.33796 17 11.9999 17ZM11.9999 2C14.7613 2 16.9999 4.23858 16.9999 7V10C16.9999 12.6888 14.8776 14.8818 12.2168 14.9954L11.9999 15C9.23847 15 6.9999 12.7614 6.9999 10V7C6.9999 4.31125 9.1222 2.11818 11.783 2.00462L11.9999 2ZM11.9999 4C10.4022 4 9.09623 5.24892 9.00499 6.82373L8.9999 7V10C8.9999 11.6569 10.343 13 11.9999 13C13.5976 13 14.9036 11.7511 14.9948 10.1763L14.9999 10V7C14.9999 5.34315 13.6567 4 11.9999 4Z"></path></svg></span> Log in</Link>
                    <Link href="/" className="signup-btn flex items-center">Sign up <span className="ml-1"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg> </span></Link>
                  </div>
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

        <Link href="/" className="block text-gray-800 text-lg mt-4">
            Log in
        </Link>
        <Link href="/" className="block signut-bg text-white py-2 px-4 rounded mt-2 text-center">
            Sign up
        </Link>
    </nav>
</div>

       </>
  );
}
