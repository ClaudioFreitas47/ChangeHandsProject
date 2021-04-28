import React, { Component } from "react";
import UserNavbar from "./../Nav/UserNavbar";
import { Container, Col, Row, Table, Image } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { apiRootUrl, apiRootFileUrl, } from "./../../../appConfig";
import notification from "./../../../Alerts"
import "./../../../../Assets/Styles/Main.css";
import swal from "sweetalert2"
import {
  FaEdit,
  FaTrashAlt
 } from "react-icons/fa";

export default class MyProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
    //handles the deletion of the product
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
  }
  //sends the product ID to the DB
  handleDeleteProduct = (product) => (e) => {
    e.preventDefault();

    //sends data to the API
    const data = {
      id: product._id,
    };

    //sweetalert used to make a confirmation alert for deletion
    swal.fire({
      title: 'Are you sure?',  
      text: 'Once deleted, you will not be able to recover this item!',  
      icon: 'warning',  
      showCancelButton: true,
      showCloseButton: true,  
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',  
      confirmButtonText: 'Delete'  
    })
    //if the result is confirm, it deletes the brand
    .then((result) => {
if (result.isConfirmed) { 

    //post request to send the ID for deletion
    axios.post(apiRootUrl + "/products/deleteProduct ", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    //returns success message
      .then(() => {
        this.getAllProduct();
        notification("success", "Success", "Product Has Been Deleted");
      })
      //returns an error message if issues encountered
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
    }
  })
  };

  //API call to get all the users uploaded products, uses Auth token
  getAllProduct() {
    axios.get(apiRootUrl + "/products/getMyProducts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
//returns the products data
      .then((res) => {

        this.setState({
          products: res.data.data,
        });
      })

      //returns error if issues encountered
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }
  componentDidMount() {
    this.getAllProduct();
  }
  render() {
    return (
      <>
        <UserNavbar />
        <div className="table-top">
          <h2>My Products</h2>
        </div>
        <Container>
          <Row>
            <Col lg={1} md={1} xs={0}></Col>
            <Col lg={10} md={10} xs={10}>
              <Table responsive='sm' striped hover>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Product Description</th>
                    <th>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.products.length > 0 ? (
                    this.state.products.map((product) => {
                      return (
                        <tr key={product._id}>
                          <td>
                            <Link to={`/product-details/${product._id}`}>
                            <Image
                              src={`${apiRootFileUrl}/${product.image}`}
                              className='image-product'
                              rounded
                            />
                            </Link>
                          </td>
                          <td>{product.name}</td>
                          <td>£ {product.price}</td>
                          <td>{product.description}</td>
                          <td>
                            <button className="btn-edit">
                           
                              <Link to={`/edit-product/${product._id}`}>
                              <FaEdit className="icons"/>
                                Edit
                              </Link>
                            </button>
                            <button className="btn-delete"
                              onClick={this.handleDeleteProduct(product)}
                            >
                              <FaTrashAlt className="icons"/>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan='6'>No Products Are Available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
