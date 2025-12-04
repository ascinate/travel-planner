import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
     margin:30,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
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

export default function TestmoliasSlider() {


    const items = [
    { title: "Danis Jan", location:"Japna", img: "/crad015.jpg", descr:"Absolute perfection Egens Labs web development services left me completely satisfied and eager to recommend them to others.", },
    { title: "Rose M", location:"Fransh", img: "/paris.jpg", descr:"Absolute perfection Egens Labs web development services left me completely satisfied and eager to recommend them to others.", },
    { title: "Jasica", location:"China", img: "/pexels-jcosta-13800608.jpg", descr:"Absolute perfection Egens Labs web development services left me completely satisfied and eager to recommend them to others.", },
    { title: "Simona", location:"Canda", img: "/crade015.jpg", descr:"Absolute perfection Egens Labs web development services left me completely satisfied and eager to recommend them to others.", },
  ];

  return (
     <>
     <div className="w-full  py-6">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="">
            <div className="man-crads">
              <div className="bg-white p-4 card-sections-testimolias rounded-xl shadow-md overflow-hidden hover:scale-105 transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(38,38,38,1)"><path d="M19.4167 6.67891C20.4469 7.77257 21.0001 9 21.0001 10.9897C21.0001 14.4891 18.5436 17.6263 14.9695 19.1768L14.0768 17.7992C17.4121 15.9946 18.0639 13.6539 18.3245 12.178C17.7875 12.4557 17.0845 12.5533 16.3954 12.4895C14.591 12.3222 13.1689 10.8409 13.1689 9C13.1689 7.067 14.7359 5.5 16.6689 5.5C17.742 5.5 18.7681 5.99045 19.4167 6.67891ZM9.41669 6.67891C10.4469 7.77257 11.0001 9 11.0001 10.9897C11.0001 14.4891 8.54359 17.6263 4.96951 19.1768L4.07682 17.7992C7.41206 15.9946 8.06392 13.6539 8.32447 12.178C7.78747 12.4557 7.08452 12.5533 6.39539 12.4895C4.59102 12.3222 3.16895 10.8409 3.16895 9C3.16895 7.067 4.73595 5.5 6.66895 5.5C7.742 5.5 8.76814 5.99045 9.41669 6.67891Z"></path></svg>
                <div className="p-4">
                  <h4> {item.title} </h4>
                  <p> {item.descr}  </p>
                 
                 <div className="flex items-center py-4">
                     <div className="usert01 ">
                         <Image
                            src={item.img}
                            alt={item.title}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                            />
                     </div>
                     <h4 className="ml-3"> {item.title} <span className="block">{item.location} </span> </h4>
                 </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
     </>
  );
}
