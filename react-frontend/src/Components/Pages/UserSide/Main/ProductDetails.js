import React, { useState, useEffect } from "react";
import UserNavbar from "./../Nav/UserNavbar";
import VisitorNavbar from "./../../Visitor/VisitorNavbar";
import TimeAgo from "react-timeago";
import StarRatings from "react-star-ratings";
import Loader from './../../../Loader'
import {
  Container,
  Col,
  Row,
  ListGroup,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "./../../../../Assets/Styles/ProductDetails.css";
import axios from "axios";
import { apiRootUrl, apiRootFileUrl,} from "../../../appConfig";
import notification from "./../../../Alerts"
import "./../../../../Assets/Styles/Main.css"

import {
  FaHeart,
  FaBookmark
 } from "react-icons/fa";

 //use states for rating likes and product
const ProductDetails = () => {
  const token = localStorage.getItem("token");
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [rated, setRated] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [likes, setLikes] = useState([]);

  //handles the like feature, and send the data if the user has liked the product
  const like = (e) => {
    e.preventDefault();
    let data = {
      product: productId,
    };
    
    addLikeOrSave(data, "likeProduct");
  };

  //handles the save feature and if the user has saved the product
  const save = (e) => {
    e.preventDefault();
    let data = {
      product: productId,
    };
    addLikeOrSave(data, "saveProduct");
  };

  //posts the data to the product API with the new data
  const addLikeOrSave = (data, url) => {
    axios.post(apiRootUrl + `/products/${url}`, data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    //returns success message if successful
      .then((res) => {

        notification("success", "Success", res.data.message);
      })

      //returns error message if unsuccessful
      .catch((err) => {

        notification("error", "Error", err.response.data.error)
      });
  };
  //API get request to get the product using the product ID
  useEffect(() => {
    getSingleProduct();
  }, []);

  const getSingleProduct = () => {
    axios.get(apiRootUrl + `/products/getSingleProduct?productId=${productId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    //sets the product with the new data
      .then((res) => {
        setProduct(res.data.data);

//caculates the total of the ratings and adds it to the product page
        setLikes(res.data.likes);
        
        let ratings = res.data.ratings;

        if (ratings.length > 0) {
          let total = 0;
          ratings.forEach((rating) => {
            total = total + rating.rate;
          });


          setTotalReviews(ratings.length);

          let average = total / ratings.length;
          setRated(average);
        } else {
          setRated(0);
        }
      })
      //returns error message if any errors encountered
      .catch((err) => {

        notification("error", "Error", err.response.data.error)

      });
  };
  //if user isnt authenticated a Vistor Nav is present
  //if the product doesnt exist a loader is present
  return (
    <>
      <div>
        {token ? <UserNavbar /> : <VisitorNavbar />}
        <div className="table-top">
          <h2>Product Details</h2>
        </div>

        {product === null ? (
          
          <Loader/>
        ) : (
          
          //the img source is located in the API root uploads folder
          <Container className="profile-shadow">
            <Row className='mb-5 pt-3 pb-3'>
              <Col md={7} sm={12} lg={7} xs={12}>
                <img
                  className='product-img'
                  src={`${apiRootFileUrl}/${product.image}`}
                  alt='product'
                />
              </Col>

              <Col md={5} sm={12} lg={5} xs={12}>
                <div className='d-flex align-items-center'>
                <Link to={`/profile/${product.createdBy.username}`}>
                  <img
                    src={
                      product.createdBy.profile !== null
                        ? `${apiRootFileUrl}/${product.createdBy.profile}`
                        : `${apiRootFileUrl}/standard-profile/standard-profile.png`
                    }
                    className='profile-pic'
                    alt='user profile'
                  />
                  </Link>
                  <div className='link d-flex flex-column ml-3'>
                    <Link to={`/profile/${product.createdBy.username}`}>
                      <strong>
                        {product.createdBy.username}
                      </strong>
                    </Link>

                    {/*React star ratings used to show the ratings of each user */}
                    <p>
                      {rated > 0 ? (
                        <>
                          <div>
                            <StarRatings
                              rating={rated}
                              starDimension='15px'
                              starRatedColor='#EE6C87'
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
                              starDimension='15px'
                              starRatedColor='#EE6C87'
                              starSpacing='5px'
                              name='rated'
                            />
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                 
                <div className='mt-4'>
                <FaHeart size={28} className="product-icon-heart" onClick={like}/>
                <FaBookmark size={28} className="product-icon-save" onClick={save}/>

                  <p>{likes.length} Likes</p>
                </div>
                <hr />
                <p>Product Description </p>

                <p>{product.description} </p>
                
                <ListGroup variant='flush'>
                  <ListGroup.Item className='d-flex justify-content-between'>

                    <span>Price</span>
                    <span>£ {product.price}</span>

                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between'>

                    <span>Size</span>
                    <span>{product.size}</span>

                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between'>

                    <span>Brand</span>
                    <span>{product.brand.name}</span>

                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between'>

                    <span>Condition</span>
                    <span>
                      {product.condition === null ? "N/a " : product.condition}
                    </span>

                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between'>
                    <p className='grey'>

                      Listed <TimeAgo date={product.createdAt} />
                    </p>

                  </ListGroup.Item>
                </ListGroup>
                
                <Link to={`/inbox/${product.createdBy._id}`}>
                  <button className='btn-product'>
             
                    <strong>Message</strong>
                  </button>
                </Link>
              </Col>
            </Row>
          </Container>
          
        )}
        <div className="bottom"/>
      </div>
    </>
  );
};

export default ProductDetails;
