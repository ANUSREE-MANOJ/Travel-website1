import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const AgentRoute=()=>{
    const{userInfo} =useSelector((state)=>state.auth)
    return userInfo && userInfo.userType=='travelAgent'?(
        <Outlet/>
    ):(
        <Navigate to ="/login" replace/>
    )
}

export default AgentRoute