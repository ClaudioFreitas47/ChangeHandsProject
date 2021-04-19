import React, { useState, useEffect } from "react";
import UserNavbar from "./../Nav/UserNavbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { apiRootUrl, apiRootFileUrl,}  from "./../../../appConfig";
import Loader from './../../../Loader'
import StarRatings from "react-star-ratings";
import { Container, Col, Row, Modal } from "react-bootstrap";
import "./../../../../Assets/Styles/Profile.css";
import "./../../../../Assets/Styles/Main.css";
import notification from "./../../../Alerts"

//importing Font Awesome Icons
import {
  FaEnvelope,
  FaUser
 } from "react-icons/fa";

 //usestate for the profile page, sets all the states for the items 
const Profile = (props) => {
  const [profileDetails, setProfileDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(0);
  const [ratingExists, setRatingExists] = useState(true);
  const [birthDate, setBirthDate] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);

  const changeRating = (newRating) => {
    setRating(newRating);
  };

  //handles the user rating given by another user
  const rateUser = () => {
    setShow(false);
    const data = {
      user: profileDetails._id,
      rate: rating,
    };

    //posts the user rating to the DB
    axios.post(apiRootUrl + `/ratings/addRating`, data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    //responds with a success message, if succesfull
      .then((res) => {
        getProfileDetails();
        notification("success", "Success", res.data.message);
      })
//responds with an error message if unsuccessful
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  };

  //gets the dates for the users birthdate
  const setoutDate = (userBirthDate) => {
    var todayTime = new Date(userBirthDate);
    
    //sets out the list of month names
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var month = todayTime.getMonth();
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();

    month = months [month];

    return day + " " + month + " " + year;
  };
  //gets all the data surrounding the profile
  const getProfileDetails = () => {
    //gets the API root for all the user data and uses the token to authenticate
    axios.get(
      apiRootUrl +
        `/auth/getProfileDetails?username=${props.match.params.username}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    //sets the profile details as the data 
      .then((res) => {
   
        setProfileDetails(res.data.data);

        //if there is no user birthdate set it uses the standard birthdate
        let UserBirthDate = res.data.data.birthDate;
        if (UserBirthDate !== null) {
          setBirthDate(setoutDate(UserBirthDate));
        } else {
          setBirthDate(null);
        }

        setProducts(res.data.products);
        setRatingExists(res.data.ratingExists);

        //adds up the ratings of the profile page
        let ratings = res.data.ratings;
        if (ratings.length > 0) {
          let total = 0;
          ratings.forEach((rating) => {
            total = total + rating.rate;
          });

          setTotalReviews(ratings.length);

          //gets the average of the ratings
          let average = total / ratings.length;
          setRated(average);
        } else {
          setRated(0);
        }
        //catches any errors and displayed error message
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  };
  //gets profile details after render
  useEffect(() => {
    getProfileDetails();
  }, []);

  const token = localStorage.getItem("token");
  const [show, setShow] = useState(false);
//used to open and close the ratings window
  const closeRating = () => setShow(false);
  const showRating = () => setShow(true);
  return (
    <div>
      
      <UserNavbar />
      <div className="table-top">
          <h2>Profile</h2>
        </div>
      {/*If no profile is present a loading spinner appears */}
      {profileDetails === null ? (
       <Loader/>
      ) : (
        <>
      {/*Bootstrap containers, rows, cols used to layout page */}
          <Container className="profile-shadow">
            <Row className="pt-3">
              <Col md={4} sm={12}>
                {/*location of profile pic*/}
                <img
                  className='profile-picture'
                  src={
                    profileDetails.profile !== null
                      ? `${apiRootFileUrl}/${profileDetails.profile}`
                      : `${apiRootFileUrl}/standard-profile/standard-profile.png`
                  }
                  alt='profile'
                />
                <div className='mt-3'>
                  <p className='font-weight-bold border-about'>About me</p>
                 
                </div>
                {profileDetails.aboutMe}
              </Col>
              <Col md={8} sm={12}>
                <div className='d-flex justify-content-between'>
                  <div className='d-flex '>
                    <div>
                      <h3> {profileDetails.username}</h3>
                    </div>
                    
                  </div>
                  <div className='mt-2'>
                    {/*if the rating doesnt exist already a button will appear allowing the uset to rate*/}
                  {ratingExists ? null : (
                    <button className="btn-auth" onClick={showRating}>
                      Rate Me
                    </button>
                  )}
{/*Modal used to display rating section*/}
                  <Modal show={show} onHide={closeRating} centered>
                    <Modal.Header closeButton>
                  <Modal.Title>Rate {profileDetails.username}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Rate {profileDetails.username}'s Profile</p>

                      <StarRatings
                        rating={rating}
                        changeRating={changeRating}
                        numberOfStars={5}
                        starSpacing='5px'
                        name='rating'
                      />
                      
                    </Modal.Body>
                    <Modal.Footer>
                      <button className="btn-auth" onClick={closeRating}>
                        Close
                      </button>
                      <button className="btn-auth" onClick={rateUser}>
                        Save Changes
                      </button>
                    </Modal.Footer>
                  </Modal>
                  </div>
                </div>
                <div>
                  <span className='text-grey'>Ratings</span>
                </div>
                <div>
                  {/*StarRatings displays the rating stars*/}
                  {rated > 0 ? (
                    <>
                      <div>
                        <StarRatings
                          rating={rated}
                          starRatedColor='#EE6C87'
                          starDimension='15px'
                          starSpacing='5px'
                          name='rated'
                        />
                      </div>

                      <div>              
                        <span>
                          {rated} ({totalReviews} Total Reviewes )
                        </span>
                      </div>
                    </>
                  ) : (
                    <span>
                      <StarRatings
                          rating={rated}
                          starRatedColor='#EE6C87'
                          starDimension='15px'
                          starSpacing='5px'
                          name='rated'
                        />
                    </span>
                  )}
                </div>
                <div className=' mt-3 d-flex'>
                  <div className="profile-msg">
                    <Link to={`/inbox/${profileDetails._id}`}>
                    <FaEnvelope size={24} className="profile-icon"/>
                      <strong className="profile-msg">Message</strong>
                    </Link>
                  </div>
                </div>
                <div className='mt-5'>
               {/*Displays all user information if it exists, if it doesnt it displays N/a */}
               <FaUser className="profile-icon" size={24}/> 
                          <span>About</span>
                          <hr/>
                      <p className='mt-4 text-grey'>Contact information</p>
                      <div>
                        <strong>Contact:</strong>
                        <strong className='about-info'>
                          {profileDetails.contactNum}
                        </strong>
                      </div>

                      <div>
                        <strong className="mr-2">E-mail:</strong>
                        <strong className='about-info'>
                          {profileDetails.email}
                        </strong>
                      </div>
                      <div>
                        <strong>Socials: </strong>
                        <strong className='about-info'>
                          {profileDetails.social}
                        </strong>
                      </div>
                      <p className='text-grey mt-5'>Basic Information</p>
                      <div className='mt-3'>
                        <strong>Birth Date:</strong>
                        <strong className='ml-2'>
                       
                          {birthDate}
                        </strong>
                      </div>
                      <div>
                        <strong className="mr-2">Gender:</strong>
                        <strong className='ml-4'>
                          {profileDetails.gender === true ? "Male" : "Female"}
                        </strong>
                      </div>
      
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={12}>
                <p className='font-weight-bold border-items'>Items</p>
              </Col>
            </Row>
            <Row className="pb-4">
            <Col md={12} sm={12}>
              <div className='product-item mt-5'>
                {/*maps out each product details onto the profile page*/}
                {products.map((product) => {
                  return (
                    <div className='d-flex flex-column'>
                      <strong className='mb-2'>{product.name}</strong>
                      <img
                        src={`${apiRootFileUrl}/${product.image}`}
                        height='150'
                        width='150'
                        alt=''
                      />
                      
                      <strong>£ {product.price}</strong>
                      <Link to={"/product-details/" + product._id}>
                        <button
                          className="btn-buy"
                          productId={product._id}
                        >
                          Buy Now
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
          <div className="bottom"></div>
        </>
      )}
    </div>
    
  );
};

export default Profile;
