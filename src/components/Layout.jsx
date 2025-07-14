import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";

const Layout = () => {

    return (
        <>
            <Appbar />
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default Layout;