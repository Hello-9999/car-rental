import styles from "../index";
import { navLinks } from "../constants";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdMenuOpen } from "react-icons/md";
import { useState } from "react";
import { Drawer } from "antd";
import carLogo from "../Assets/car-logo.png";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);

  return (
    <div
      className={`w-full   flex justify-between items-center   px-2   py-3      bg-[#222733]`}
    >
      <Link to="/">
        <div className="p-[2px]  ">
          <div className=" ">
            <div className="text-[18px] md:text-[20px] lg:text-[25px] font-poppins font-bold bg-gradient-to-br from-green-600 to-white bg-clip-text text-transparent     py-3 ">
              <span>Rent a Ride</span>
            </div>
            {/* <img
              src={carLogo}
              alt="Logo"
              className="w-[90px]  object-cover  "
            /> */}
          </div>
        </div>
      </Link>

      <div className="hidden lg:block">
        <ul className="flex list-none">
          {navLinks.map((navlink, index) => (
            <li
              key={index}
              className={`${index != navLinks.length - 1 ? "mx-4" : "mx-0"}`}
            >
              <Link
                to={navlink.path}
                className={`block py-2 px-3 text-white   rounded cursor-pointer font-semibold font-poppins    md:p-0 `}
              >
                {navlink.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <div className="hidden md:inline-flex">
          <Link to={"/signIn"}>
            {currentUser && !currentUser.isAdmin ? (
              ""
            ) : (
              <button
                id="signin"
                className={`border-[1px] hidden lg:inline-flex border-green-500 py-1 text-[12px] md:text-[14px] sm:py-[7px] px-2 sm:px-4 font-normal sm:font-semibold rounded-md `}
              >
                Sign In
              </button>
            )}
          </Link>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          {currentUser && !currentUser.isAdmin ? (
            <Link
              to={"/profile"}
              className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full  md:me-0   dark:text-white"
            >
              <img
                src={`${currentUser.profilePicture}`}
                alt="fsd"
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-[50%] object-cover"
              />
            </Link>
          ) : (
            <div className="hidden lg:inline-flex">
              <Link to={"/signup"}>
                <button id="signup" className={`${styles.button} `}>
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/*  Mobile Menu */}
        <div className="relative lg:hidden flex justify-center items-center">
          <button onClick={() => setNav(!nav)}>
            <div>{nav ? <MdMenuOpen /> : <RxHamburgerMenu />}</div>
          </button>
          <Drawer
            destroyOnClose={true}
            onClose={() => setNav(false)}
            open={nav}
          >
            <div className="flex flex-col items-start justify-between gap-y-10">
              {navLinks.map((navlink, index) => (
                <Link
                  key={index}
                  to={navlink.path}
                  className="text-[26px]"
                  onClick={() => setNav(false)}
                >
                  {navlink.title}
                </Link>
              ))}

              {currentUser && !currentUser.isAdmin && (
                <div>
                  <Link to={"/profile"}>
                    <div
                      id="signup"
                      className={` rounded-md font-semibold text-[24px]`}
                    >
                      Profile
                    </div>
                  </Link>
                </div>
              )}

              <div>
                <Link to={"/signIn"}>
                  {currentUser && !currentUser.isAdmin ? (
                    ""
                  ) : (
                    <button
                      id="signin"
                      className={` rounded-md  text-[24px] font-semibold  `}
                    >
                      Sign In
                    </button>
                  )}
                </Link>
              </div>

              <div>
                {currentUser && !currentUser.isAdmin ? (
                  ""
                ) : (
                  <div>
                    <Link to={"/signup"}>
                      <button
                        id="signup"
                        className=" rounded-md  text-[24px] font-semibold "
                      >
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Drawer>
          {nav && (
            <div>
              <div className="absolute top-6 z-10 right-0  ">
                <Link to={"/signIn"}>
                  {currentUser && !currentUser.isAdmin ? (
                    ""
                  ) : (
                    <button
                      id="signin"
                      className={`border-[1px] w-[80px]  border-green-500 bg-green-500  py-1 text-[10px]   px-2  font-normal sm:font-semibold  `}
                    >
                      Sign In
                    </button>
                  )}
                </Link>
              </div>

              <div>
                {currentUser && !currentUser.isAdmin && (
                  <div className="hidden lg:inline-flex">
                    <Link to={"/signup"}>
                      <button id="signup" className={`${styles.button} `}>
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
