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
    { title: "Paris", img: "/images/paris.jpg", link: "/destinations/paris" },
    { title: "Tokyo", img: "/images/tokyo.jpg", link: "/destinations/tokyo" },
    { title: "New York", img: "/images/newyork.jpg", link: "/destinations/newyork" },
    { title: "London", img: "/images/london.jpg", link: "/destinations/london" },
  ];

  return (
     <>
     <div className="w-full px-4 py-6">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="px-3">
            <Link href={item.link}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center font-semibold text-lg">
                  {item.title}
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
