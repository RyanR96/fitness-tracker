import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute(props) {
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);

  if (decode.exp * 1000 < Date.now()) {
    //localstorage.remove and navigate to login
    console.log("Expired");
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
}

export default ProtectedRoute;
