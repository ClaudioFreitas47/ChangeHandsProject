import React, { Component } from "react";
import UserNavbar from "./../Nav/UserNavbar";
import VisitorNavbar from "./../../Visitor/VisitorNavbar";
import {
  Container,
  Col,
  Row,
  Carousel, 
  Jumbotron
} from "react-bootstrap";
import "./../../../../Assets/Styles/Main.css";
import image1 from "./../../../../Assets/Images/carousel_1.jpg"
import image2 from "./../../../../Assets/Images/carousel_2.jpg"
import image3 from "./../../../../Assets/Images/carousel_3.jpg"
import image4 from "./../../../../Assets/Images/homepage_img_1.jpg"
import image5 from "./../../../../Assets/Images/homepage_img_2.jpg"
import { Link } from "react-router-dom";

export default class MainHomePage extends Component {

  render() {
    const token = localStorage.getItem("token");
    return (
      //displays Visitor Nav if user isnt authenticated
      <>
        {token ? <UserNavbar /> : <VisitorNavbar />}

{/*Displays carousel using uploaded images */}
      <Jumbotron className='bg pl-0 pr-0'>
  <Carousel className='mt-4'>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src= {image1}
      alt="First slide"
    />
    <Carousel.Caption>
      <h1>Buy</h1>
      <h2>Find exclusive items</h2>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src={image2}
      alt="Second slide"
    />

    <Carousel.Caption>
      <h1>Sell</h1>
      <h2>The best place to sell old items</h2>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src={image3}
      alt="Third slide"
    />

    <Carousel.Caption>
      <h1>Explore</h1>
      <h2>Find new items and communicate with users in real time</h2>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
  
</Jumbotron>
<Jumbotron className="bg-2 mt-5">
<Container>
  <Row className="mb-5">
  <Col className="narrative mr-5" lg={6} md={5} xs={12}>
    <h3 className="heading mb-5">What is Change Hands</h3>
    <p>Change Hands is a local marketplace where users can come and find unique items and let go of old items. We are a platform that allows buying, selling and communication to make allow connection between users for the transmission of items. We are here to transform the island to promote wastelessness and allow users to buy or sell without needing to go elsewhere</p>
    <div>
    <button className="btn-home mb-3"><Link to="/register">Register Now </Link></button>
    </div>
  </Col>
  <Col className="narrative" lg={4} md={5} xs={12}>
   <img className="narrative-img" src= {image4} alt="shaking hands"></img>
    </Col>
  </Row>
  </Container>
  <Row className="pt-5">
  <Col className="mr-5" lg={4} md={5} xs={12}>
  <img className="narrative-img pb-5" src={image5} alt="records"></img>
  </Col>
  <Col className="narrative" lg={6} md={5} xs={12}>
  <h3 className="heading mb-5">Find what you need</h3>
  <p>The best second hand market available to find whatever you need. Clothes? Electronics? Jewellery? We have it all, come explore and sell those unwanted items you no longer need, or buy items you need! </p>
  <div>
  <button className="btn-home mb-3"><Link to="/login">Come Explore</Link></button>
  </div>
    </Col>
  </Row>
 

</Jumbotron>
<div className="bottom"></div>
      </>
    );
  }
}
