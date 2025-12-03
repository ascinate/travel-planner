"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
     margin:30,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },

      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      }
    ]
  };

export default function ExploreSlider() {


    const items = [
    { title: "Discover Mount Paris", location:"", img: "/crad015.jpg", descr:"We learned so much about the rich history of Chicago, the people who started ", link: "/destinations/paris" },
    { title: "Fuji Tokyo", location:"", img: "/paris.jpg", descr:"We learned so much about the rich history of Chicago, the people who started ", link: "/destinations/tokyo" },
    { title: "Explore New York", location:"", img: "/pexels-jcosta-13800608.jpg", descr:"We learned so much about the rich history of Chicago, the people who started ", link: "/destinations/newyork" },
    { title: "13 best places to travel", location:"", img: "/crade015.jpg", descr:"We learned so much about the rich history of Chicago, the people who started ", link: "/destinations/london" },
  ];

  return (
     <>
     <div className="w-full  py-6">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="">
            <Link href={item.link} className="man-crads">
              <div className="bg-white card-sections rounded-xl shadow-md overflow-hidden hover:scale-105 transition">
                <figure>
                    <Image
                    src={item.img}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    />
                    <figcaption>{item.location}</figcaption>
                </figure>
                <div className="p-4 text-center text-block font-semibold text-lg">
                  <h4> {item.title} </h4>
                  <p> {item.descr}  </p>
                  <div className="btn-divu flex items-center"> View Details <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg> </div>

                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
     </>
  );
}
