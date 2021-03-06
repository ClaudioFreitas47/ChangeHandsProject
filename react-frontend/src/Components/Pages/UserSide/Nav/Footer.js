import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import './../../../../Assets/Styles/Footer.css';


const Footer =() => {
    //if token is present it displays the product dashboard route, otherwise login and register are displayed
    const token = localStorage.getItem("token")

    return (
        <div className="footer">
            <Container>
            <ul className="footer-ul">
                <Link to="/">
                <li className="footer-li">Home</li>
                </Link>
                <li className="footer-li"> |</li>
                {!token ? <>
                    <Link to="/login">
                <li className="footer-li">Login</li>
             </Link>
             <Link to="/register">
                <li className="footer-li">Register</li>
                </Link>
                </>
                :
                <>
                <Link to="/product-dashboard">       
                <li className="footer-li">Buy & Sell</li>
                </Link> 
                </>
}
                <Link to="/admin">
                <li className="footer-li">Admin</li>
                </Link>
                <li className="footer-li">|</li>
                <Link to="/report">
                <li className="footer-li">Report An Issue</li>
                </Link>
            </ul>
            </Container>
        </div>
    )
}

export default Footer; 
