import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import './../../../../Assets/Styles/Footer.css';

const Footer =() => {

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

                <li className="footer-li">Contact: 01534111</li>
            </ul>
            </Container>
        </div>
    )
}

export default Footer; 
