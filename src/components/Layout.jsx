import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";

const Layout = () => {

    return (
        <>
            <Appbar />
            <div style={{ marginTop: "20px" }}>
                <Outlet />
            </div>
        </>
    )
}

export default Layout;