import React, { Component } from "react";
import { Container, Row, Col, Table, Image } from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl, apiRootFileUrl } from "./../../appConfig";
import notification from "./../../Alerts"
import swal from "sweetalert2"

import {
FaTrashAlt
} from "react-icons/fa";

export default class AdminHomePage extends Component {
  
  //sets the users array to empty
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
    //handles the deletion of the user
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
  }
//handles deletion of user and prevents event from occuring
  handleDeleteUser = (user) => (e) => {
    e.preventDefault();

    //stores user id in a variable
    const data = {
      id: user._id,
    };
//swal fire alert used to add delete confirmation
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
    //API post of user ID for deletion, requires admin auth
    axios.post(apiRootUrl + "/admin/users/deleteUser", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })
      //success message if user is deleted
      .then((res) => {
    
        this.getAllUsers();
        notification("success", "Success", res.data.message);
      })

      //error message if any errors occur 
      .catch((err) => {
          notification("error", "Error", err.response.data.error)
      });
    }
  })
  };
  //API Gets all the users to display within the table
  getAllUsers() {
    axios.get(apiRootUrl + "/admin/users/getAllUsers", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })
    //success responds with user data
      .then((res) => {

        this.setState({
          users: res.data.data,
        });
      })
      //displays any errors if they occur
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }
  componentDidMount() {
    this.getAllUsers();
  }
  render() {
    return (
      <>
        <AdminNavBar />
        <div className="table-top">
          <h2>User Profiles</h2>
        </div>
        <Container>
          <Row>
            <Col lg={3} md={3} xs={3}></Col>
            <Col lg={8} md={8} xs={8}>
              <Table responsive='sm' striped hover>
                <thead className="table-head">
                  <tr>
                    <th>Profile</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.users.length > 0 ? (
                    this.state.users.map((user) => {
                      return (
                        //maps out all user data within a table
                        <tr key={user._id}>
                          <td>
                            <Image
                              src={
                                user.profile === null
                                  ? `${apiRootFileUrl}/standard-profile/standard-profile.png`
                                  : `${apiRootFileUrl}/${user.profile}`
                              }
                              roundedCircle
                              width="75"
                              height="75"
                              
                            />
                          </td>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>

                          <button className="btn-delete"
                              onClick={this.handleDeleteUser(user)}
                            >
                              <FaTrashAlt className="icons"/>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    //displays empty table if users dont exist
                    <tr>
                    
                      <td colSpan='7'>No Users Available</td>
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
