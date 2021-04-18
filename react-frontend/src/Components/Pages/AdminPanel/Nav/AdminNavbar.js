import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { adminSideNavData } from "./AdminSideNavData";
import { Dropdown } from "react-bootstrap";
import "./../../../../Assets/Styles/UserNavbar.css";
import { logoutAdmin} from "../../../appConfig"

const AdminNavBar = () => {
  
  useEffect(() => {
//takes the user to the login page if no role or auth tocken is present
    if (localStorage.getItem("token_admin") && localStorage.getItem("role")) {
      if (localStorage.getItem("role") === "admin") {

      } else {
        window.location = "/admin/login";
      }
    } else {

      window.location = "/admin/login";
    }
  }, []);

 
  return (
    <>
      <div className='main-nav'>
        <div>
        <Link to='#' className='toggle-menu'>
          </Link>
          <Link className="admin-logo" to="/">Change Hands</Link>
      
        </div>
        <div>
          <span className='account-setting'>
            <Dropdown className="mr-4">
              <Dropdown.Toggle>Admin</Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href='/admin/account-settings'>
                  Account settings
                </Dropdown.Item>
                <Dropdown.Item onClick={logoutAdmin}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </div>
      </div>
        <nav className="side-nav active">
          <ul>
            <li className='nav-side-list-admin'>
              <Link to="/admin/home"><h4>Admin Panel</h4> </Link>
            </li>
            {/*Maps out all of the side data */}
            {adminSideNavData.map((item, index) => {
              return (
                <li key={index} className={item.name}>
                  <Link to={item.path}>
                    {item.icon}
                    <span className='items'>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
    </>
  );
};

export default AdminNavBar;
