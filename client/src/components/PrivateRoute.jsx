import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  //i should make a isUser field or this will become so messy in future
  const isUserOnly = currentUser && !currentUser.isAdmin;
  return isUserOnly ? <Outlet /> : <Navigate to={"/signin"} />;
}

export const PrivateSignin = () => {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    //signin or signout available only if there is no current user
    return <Outlet />;
  }

  // Check the user's role and redirect accordingly
  if (currentUser.isAdmin) {
    return <Navigate to="/adminDashboard" />;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
