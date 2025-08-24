import { FiShoppingBag } from "react-icons/fi";
import { FaUserAlt, FaCarAlt, FaCreditCard } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

export const links = [
  {
    title: "Profile",
    links: [
      {
        name: "Profile Information",
        icon: <FaUserAlt />,
        to: " ",
      },
      {
        name: "My Vehicles",
        icon: <FaCarAlt />,
        to: "myvehicles",
      },
      {
        name: "Add Vehicles",
        icon: <FaPlus />,
        to: "addvehicles",
      },
      // {
      //   name: "favorites",
      //   icon: <FiShoppingBag />,
      // },
      {
        name: "My Bookings",
        icon: <FaCreditCard />,
        to: "mybookings",
      },
    ],
  },
];
