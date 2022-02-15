import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./auth/auth";

// const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
//   const {currentUser} = useContext(AuthContext);
//   return (
//     <Route
//       {...rest}
//       render={routeProps =>
//         !!currentUser ? (
//           <RouteComponent {...routeProps} />
//         ) : (
//           <Navigate to={"/login"} />
//         )
//       }
//     />
//   );
// };
// export default PrivateRoute

export default function PrivateRoute(){
    const {currentUser} = useContext(AuthContext);
    //return currentUser ? <Outlet /> : <Navigate to="/login" />;
    return <Outlet />
}