import React, { Component } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl } from "./../../appConfig";
import notification from "./../../Alerts";
import { Link } from "react-router-dom";
import swal from "sweetalert2"
import {
  FaEdit,
  FaTrashAlt
 } from "react-icons/fa";

export default class AdminAllBrands extends Component {

  //sets the brand array to empy
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
    };
    this.handleDeleteBrand = this.handleDeleteBrand.bind(this);
  }

  //handles the deletion of the brand
  handleDeleteBrand = (brand) => (e) => {
    e.preventDefault();
    
    //creates a variable of the brands ID
    const data = {
      id: brand._id,
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
    //posts API to delete brand
    
    axios.post(apiRootUrl + "/admin/brands/deleteBrand ", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })
  //returns all brands and success message
      .then(() => {
        this.getAllBrands();
          notification("success", "Success", "Brand Has Been Deleted");
      })
      .catch((err) => {
     
          notification("error", "Error", err.response.data.error)
      });
    }
    });
  
  }

  //API request to get all brands
  getAllBrands() {
    axios.get(apiRootUrl + "/admin/brands/getAllBrands", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })

      .then((res) => {
        this.setState({
          brands: res.data.data,
        });
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }
  componentDidMount() {
    this.getAllBrands();
  }
  render() {
    return (
      <>
        <AdminNavBar />
        <div className="table-top">
          <h2>All Brands</h2>
        </div>
        <Container>
          <Row>
            <Col lg={4} md={4} xs={0}></Col>
            <Col lg={6} md={6} xs={12}>
              <Table responsive='sm' striped hover>
                <thead>
                  <tr>
                    <th>Brand Name</th>
                    <th>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.brands.length > 0 ? (
                    this.state.brands.map((brand) => {
                      return (
                        <tr key={brand._id}>
                          <td>{brand.name}</td>
                          <td>
                          <button className="btn-edit">
                           
                           <Link to={`/admin/edit-brand/${brand._id}`}>
                           <FaEdit className="icons"/>
                             Edit
                           </Link>
                         </button>
                         <button className="btn-delete"
                           onClick={this.handleDeleteBrand(brand)}
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
                      <td colSpan='3'>No Brand Available</td>
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
