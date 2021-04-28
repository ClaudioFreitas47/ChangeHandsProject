import React, { Component } from "react";
import { Container, Row, Col, Table, Image } from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl, apiRootFileUrl } from "./../../appConfig";
import notification from "./../../Alerts"
import { Link } from "react-router-dom";
import swal from "sweetalert2";
import {
  FaEdit,
  FaTrashAlt
 } from "react-icons/fa";


export default class AdminAllProducts extends Component {

  //sets the product array to empty
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
  }
  //handles the deltion of the product, sends the product ID to DB
  handleDeleteProduct = (product) => (e) => {
    e.preventDefault();

//stores product id in data var

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
    .then((result) => {
      if (result.isConfirmed) { 
    //if the result is confirm, it deletes the brand

    //API post sends product ID to DB to be deleted, requires AUTH
    axios.post(apiRootUrl + "/admin/products/deleteProduct ", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })

    //Success responds with message
      .then(() => {
        this.getAllProduct();
        notification("success", "Success", "Product Has Been Deleted");
      })

      //error message if any errors occurr

      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
    }
  })
  };

  //API get to display all products wihtin the DB
  getAllProduct() {
    axios.get(apiRootUrl + "/admin/products/getAllProducts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })
    //responds with the product data
      .then((res) => {

        this.setState({
          products: res.data.data,
        });
      })
      
      //error message if any errors occur
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
        <AdminNavBar />
        <div className="table-top">
          <h2>All User Products</h2>
        </div>
        <Container>
          <Row>
            <Col lg={2} md={2} xs={3}></Col>
            <Col lg={10} md={10} xs={8}>
              <Table responsive='sm' striped hover>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Product Description</th>
                    <th>Product Owner</th>
                    <th>Product Category</th>
                    <th>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.products.length > 0 ? (
                    //maps out all the product data in the table
                    this.state.products.map((product) => {
                      return (
                        <tr key={product._id}>
                          <td>
                            <Image
                            
                              src={`${apiRootFileUrl}/${product.image}`}
                              height="125"
                              width="125"
                              rounded
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.price}</td>

                          <td>
                            {/*Slices the description so only 50 characters display */}
                            {product.description
                              ? product.description.slice(0, 100) +
                                (product.description.length > 50 ? "..." : "")
                              : null}
                          </td>
                          <td>
                            {product.createdBy.username}
                          </td>
                          <td>{product.category.name}</td>
                          <td>
                          <button className="btn-edit">
                           
                              <Link to={`/admin/edit-product/${product._id}`}>
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
                      <td colSpan='7'>No Product Available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
        <div className="bottom"/>
      </>
    );
  }
}
