import React, { Component } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl } from "../../appConfig";
import notification from "./../../Alerts"
import { Link } from "react-router-dom";
import swal from "sweetalert2"
import {
  FaEdit,
  FaTrashAlt
 } from "react-icons/fa";

export default class AdminAllCategories extends Component {
  
  //sets category array to empty
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
  }
  //handles deletion of category
  handleDeleteCategory = (category) => (e) => {
    e.preventDefault();

    //stores category id in data var
    const data = {
      id: category._id,
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

    //posts category ID to DB
    axios.post(apiRootUrl + "/admin/categories/deleteCategory ", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })
    //returns all categories and success message
      .then((res) => {
        this.getAllCategories();
        notification("success", "Success", res.data.message);
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
    }
  })
  };

  //API gets all the categories
  getAllCategories() {
    axios.get(apiRootUrl + "/admin/categories/getAllCategories", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })

      .then((res) => {

        this.setState({
          categories: res.data.data,
        });
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }
  componentDidMount() {
    this.getAllCategories();
  }
  render() {
    return (
      <>
        <AdminNavBar />
        <div className="table-top">
          <h2>All Categories</h2>
        </div>
        <Container>
          <Row>
            
            <Col lg={4} md={4} xs={0}></Col>
            <Col lg={6} md={6} xs={12}>
              <Table responsive='sm' striped hover>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.categories.length > 0 ? (
                    //Maps out all category data to table
                    this.state.categories.map((category) => {
                      return (
                        <tr key={category._id}>
                          <td>{category.name}</td>
                          <td>
                          <button className="btn-edit">
                           
                           <Link to={`/admin/edit-category/${category._id}`}>
                           <FaEdit className="icons"/>
                             Edit
                           </Link>
                         </button>
                         <button className="btn-delete"
                           onClick={this.handleDeleteCategory(category)}
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
                      <td colSpan='3'>No Category Available</td>
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
