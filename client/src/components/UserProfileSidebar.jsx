import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import { SiShopware } from "react-icons/si";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { MdOutlineCancel } from "react-icons/md";
import { links } from "./UserSidebarContent";
import { showSidebarOrNot } from "../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { CiLogout, CiUser } from "react-icons/ci";
import toast from "react-hot-toast";

const UserProfileSidebar = () => {
  const { activeMenu, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );

  console.log(
    links[0]?.links.filter((del) => del?.to !== "myvehicles" && "addvehicles"),
    "links"
  );

  const { currentUser, isLoading } = useSelector((state) => state.user);
  // const verified

  // console.log(currentUser?.isVendor);
  console.log(currentUser, "currentUser");

  const userLinks =
    currentUser?.isVendor == 0
      ? links[0]?.links.filter(
          (del) => del?.to !== "myvehicles" && del?.to !== "addvehicles"
        )
      : links[0]?.links.filter((del) => del);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-black bg-blue-50 text-md  m-2";
  //in normal mode there was dark:text-gray-200 i removed it
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-md text-gray-700   dark:hover:text-black hover:bg-slate-100 m-2";

  //SignOut
  const handleSignout = async () => {
    const res = await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    if (data) {
      toast.error(data?.msg || "Logged Out", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: 1,
        theme: "light",
        transition: "Flip",
      });
      dispatch(signOut());
      navigate("/signin");
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.succes === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to={`/`}
              onClick={() => {}}
              className="items-center flex gap-3 mt-4 ml-3 text-xl font-extrabold text-black tracking-tight "
            >
              <SiShopware />
              Rent a Ride
            </Link>
            {/* hide sidebar button */}
            <TooltipComponent content={"menu"} position="BottomCenter">
              <button
                className="text-xl rounded-full p-3 mt-4 block  hover:bg-gray-500"
                onClick={() => {
                  dispatch(showSidebarOrNot(false));
                }}
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {userLinks.map((link) => (
              <NavLink
                to={`/profile/${link.to}`}
                key={link.name}
                onClick={() => {
                  if (screenSize <= 900 && activeMenu) {
                    dispatch(showSidebarOrNot(false));
                  }
                }}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                {link.icon}
                <span className="capitalize text-gray-600">{link.name}</span>
              </NavLink>
            ))}

            <div className="flex flex-col gap-y-5">
              <div className="flex items-center mt-10 gap-2">
                <button
                  type="button"
                  className="ml-4 text-red-400"
                  onClick={handleSignout}
                >
                  Log Out
                </button>
                <CiLogout />
              </div>
              {/* <div className="ml-4">
                <button
                  className="text-red-400"
                  onClick={handleDelete}
                  type="button"
                >
                  {isLoading ? "Loading..." : "Delete User"}
                </button>
              </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileSidebar;
