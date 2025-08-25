import styles from "../../index";
import Herocar from "../../Assets/homepage_car_copy.jpeg";
import CarSearch from "./CarSearch";
import { HeroParallax } from "../../components/ui/Paralax";
import { useRef } from "react";

import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsSweetAlert } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";
import Homeimg from "../../Assets/2958_1_75633.png";

function Home() {
  const ref = useRef(null);
  const { isSweetAlert } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sweetalert = () => {
    Swal.fire({
      show: true,
      title: "",
      text: "Vehicle Booked Successfully",
      icon: "success",
      showDenyButton: true,
      confirmButtonText: "Go to Home",
      confirmButtonColor: "#22c55e",
      denyButtonColor: "black",
      denyButtonText: `See Orders`,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      } else if (result.isDenied) {
        navigate("/profile/orders");
      }
    });
    dispatch(setIsSweetAlert(false));
  };

  return (
    <>
      {isSweetAlert && sweetalert()}

      {/* This is div is the container for the dot background */}
      {/* <div className="relative h-[100vh] w-full mx-auto sm:max-w-[900px] lg:max-w-[1500px] bg-white min-h-[72vh] md:min-h-[60vh] lg:min-h-[73vh]"> */}
      <div className="relative h-[100vh] w-full mx-auto    bg-white  ">
        <div
          // className={`px-12 lg:px-28 absolute top-0   z-10 w-full   justify-between items-center flex flex-col  sm:flex-row mt-[50px] md:mt-[170px] gap-10`}
          // className="flex flex-col items-center lg:flex-row bg-gradient-to-br   from-slate-900 to-green-500 max-w-full      gap-10  py-[50px]  md:py-[100px] md:px-[100px]    h-[100vh]
          className="flex flex-col items-center lg:flex-row bg-gradient-to-br from-green-400 to-slate-900 max-w-full      gap-10  py-[50px]  md:py-[100px] md:px-[100px]    h-[100vh]

"
        >
          <div className="">
            <p className={`py-2 text-[27px] ${styles.paragraph}`}>
              " Plan your trip now "
            </p>
            <h1
              className={` md:${styles.heading2} font-extrabold text-[35px] leading-10 lg:font-bold  mb-6  lg:text-[58px] lg:mb-6  text-white`}
            >
              Save{" "}
              <span className="text-[#102C2F] uppercase text-[55px]  lg:text-[70px]">
                big
              </span>{" "}
              <br />
              <span className="text-[#102C2F]">Drive </span>
              <span className="text-white uppercase text-[55px]  lg:text-[70px]">
                More .
              </span>{" "}
              <br />
              <span
                className={`${styles.paragraph} text-justify  text-[25px] `}
              >
                - Affordable Rentals Await !
              </span>
              {/* car rental{" "}
              <span className="text-[#102C2F] uppercase text-[55px]  lg:text-[70px]">
                Service{" "}
              </span>{" "} */}
            </h1>
            <p className={`${styles.paragraph} text-justify  text-[20px] `}>
              Rent the car of your dreams. Unbeatable prices, unlimited miles,
              flexible pick-up options and much more.
            </p>
            <div className=" mt-10  lg:mt-[40px] flex gap-3">
              <button
                onClick={() => {
                  ref.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className="bg-green-500  text-black text-[12px] md:text-[16px] py-3 px-3 rounded-sm font-semibold  lg:py-3 lg:px-5"
              >
                Book Ride{" "}
                <span className="ml-2">
                  <i className="bi bi-check-circle-fill"></i>
                </span>
              </button>
              <button
                onClick={() => {
                  ref.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className="bg-black text-white rounded-sm text-[12px] md:text-[16px]  px-3 py-2 lg:py-3 lg:px-5"
              >
                Learn More{" "}
                <span>
                  <i className="bi bi-chevron-right"></i>
                </span>
              </button>
            </div>
          </div>
          <div className="object-contain hidden sm:block">
            <img src={Herocar} alt="" />
          </div>
        </div>
      </div>

      {/* <div ref={ref}>
        <CarSearch />
      </div> */}

      {/* <HeroParallax /> */}
      <div className="py-12 bg-white">
        <section aria-label="section">
          <div className="container mx-auto px-6">
            {/* Heading */}
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-[28px] md:text-[32px] font-bold text-[#031b4e]">
                Hiring a vehicle? You're at the right place.
              </h2>
              <h5 className="text-lg text-gray-600 mt-2">
                Rent a Ride , तपाइको यात्राको सहयात्री।
              </h5>
              <div className="h-5"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left side icons */}
              <div className="lg:col-span-3 space-y-8">
                <div className="flex items-start space-x-4">
                  <i className="fa fa-trophy text-green-600 text-3xl"></i>
                  <div>
                    <h4 className="font-bold text-lg">
                      Providing Luxury Car Services in Nepal
                    </h4>
                    <p className="text-gray-600 text-sm">
                      For over two decades, we've provided supreme experiences
                      in luxury car services, bringing safety and comfort to
                      every drive in Nepal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="fa fa-road text-green-600 text-3xl"></i>
                  <div>
                    <h4 className="font-bold text-lg">
                      Services Available in 50+ Major Cities of Nepal
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Rent a Ride is at your service for your extraordinary
                      adventures in major cities across Nepal. Wherever your
                      journey leads, we're here for you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle image */}
              <div className="lg:col-span-6 flex justify-center">
                <img
                  src={Homeimg}
                  alt="home_banner"
                  className="rounded-lg  max-w-full  "
                />
              </div>

              {/* Right side icons */}
              <div className="lg:col-span-3 space-y-8">
                <div className="flex items-start space-x-4">
                  <i className="fa fa-tag text-green-600 text-3xl"></i>
                  <div>
                    <h4 className="font-bold text-lg">
                      Safe Rides Anyday, Everyday (24/7 365 days)
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We are never off duty. Safe and reliable journeys, every
                      day, all year round just for you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="fa fa-map-pin text-green-600 text-3xl"></i>
                  <div>
                    <h4 className="font-bold text-lg">
                      Range of Options - Economical to Premium Cars
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Choose your favorite car from our versatile vehicle fleet
                      that caters to every need, no matter your style or budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footers />
    </>
  );
}

export default Home;
