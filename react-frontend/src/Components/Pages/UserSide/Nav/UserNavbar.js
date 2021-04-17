import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { sideNavData } from "./SideNavData";
import "./../../../../Assets/Styles/UserNavbar.css";
import {
    FaBars,
    FaUser,
    FaTimes,
  } from "react-icons/fa";
import {userLogout} from "../../../appConfig"


const UserNavbar = () => {
  const [sidenav, setSidenav] = useState(false);
  const showSidenav = () => setSidenav(!sidenav);
  

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("role")) {
      if (localStorage.getItem("role") === "user") {
      } else {
        window.location = "/login";
      }
    } else {
      window.location = "/login";
    }
  }, []);
 
  return (
    <>
      <div className='main-nav'>
        <div className="toggle">
          <Link to='#' className='toggle-menu'>
            <FaBars onClick={showSidenav}></FaBars>
          </Link>
         <Link className="logo" to="/">Change Hands</Link>
        </div>
        <div>
       
          <span className='account-setting'>
            <Dropdown  className="mr-4">
              <Dropdown.Toggle>
                <FaUser className="mr-1"></FaUser>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href='/account-setting'>
                  Account Settings
                </Dropdown.Item>
                <Dropdown.Item onClick={userLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </div>
      </div>
        <nav className={sidenav ? "side-nav active" : "side-nav"}>
          <ul>
            <li className='nav-side-list'>
              <Link to='#'>
                <FaTimes
                  onClick={showSidenav}
                ></FaTimes>
              </Link>
            </li>
            {sideNavData.map((item, index) => {
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

export default UserNavbar;
