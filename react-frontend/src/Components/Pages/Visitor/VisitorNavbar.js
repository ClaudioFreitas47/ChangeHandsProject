import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Form,} from "react-bootstrap";
import "./../../../Assets/Styles/VisitorNavbar.css";

const VisitorNavbar = () => {
  //Navbar for the Visitors
  return (
    <>
      <Navbar>
        <Navbar.Brand href='/'>Change Hands</Navbar.Brand>
        <Nav className='mr-auto'></Nav>
        <Form inline>
          <Link to='/login'>
          <button className="btn-auth">Login</button>
          </Link>
          <Link to='/register' className="ml-4">
            <button className="btn-auth">Register</button>
          </Link>
        </Form>
      </Navbar>
    </>
  );
};

export default VisitorNavbar;
