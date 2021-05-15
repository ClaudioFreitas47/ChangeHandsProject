import React, { Component } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import axios from "axios";
import { apiRootUrl } from "./../../../appConfig";
import notification from "./../../../Alerts"
import { Link } from "react-router-dom";
import VisitorNavbar from "./../../Visitor/VisitorNavbar";
import "./../../../../Assets/Styles/Main.css"

export default class Login extends Component {
  //sets all the values to empty or false, uses state to handle properties
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: false,
      emailErrorMessage: "",
      password: "",
      passwordError: false,
      passwordErrorMessage: "",
      firstName: "",
      firstNameError: false,
      firstNameErrorMessage: "",
      lastName: "",
      lastNameError: false,
      lastNameErrorMessage: "",
      username: "",
      usernameError: false,
      usernameErrorMessage: "",

    };
    //handles all of the functions for registering use this.state
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    
    
  }

  //handles the registration, makes sure all fields are validated
  handleRegister = (e) => {
    e.preventDefault();
    const { firstName, lastName, username, email, password } = this.state;
    //firstname input validation
    if (firstName === "" || null) {
      this.setState({
        firstNameErrorMessage: "Please Enter A First Name",
        firstNameError: true,
      });
      return false;
       //lastname input validation
    } else if (lastName === "" || null) {
      this.setState({
        lastNameErrorMessage: "Please Enter A Last Name",
        lastNameError: true,
      });
      return false;
       //username input validation
    } else if (username === "" || null) {
      this.setState({
        usernameErrorMessage: "Please Enter A Username",
        usernameError: true,
      });
      return false;
       //email input validation
    } else if (email === "" || null) {
      this.setState({
        emailErrorMessage: "Please Enter An Email",
        emailError: true,
      });
      return false;
       //password input validation
    } else if (password === "" || null) {
      this.setState({
        passwordErrorMessage: "Please Enter A Password",
        passwordError: true,
      });
    } else {

      //API posts registration data to the DB
      axios.post(apiRootUrl + "/auth/register", this.state)
        //returns success message
        .then((res) => {
          console.log("user registered", res);
          notification("success", "Success", "User Has Registered Successfully!");

          //uses props.history to push the user to the login page
          this.props.history.push("/login");
        })
        //returns error message if error encountered
        .catch((err) => {
          notification("error", "Error", err.response.data.error)
        });
    }
  };

  //handles the first name
  handleFirstName = (e) => {
    this.setState({
      firstName: e.target.value,
      firstNameError: false,
    });
  };

  //handles the last name
  handleLastName = (e) => {
    this.setState({
      lastName: e.target.value,
      lastNameError: false,
    });
  };

  //handles the username
  handleUsername = (e) => {
    this.setState({
      username: e.target.value,
      usernameError: false,
    });
  };


  //handles the email
  handleEmail = (e) => {
    this.setState({
      email: e.target.value,
      emailError: false,
    });
  };

  //handles the registration password
  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
      passwordError: false,
    });
  };

  render() {
    return (
      <>
        <VisitorNavbar />
        <div className="top" />
        <Container>
          <Row>
            <Col lg={3} md={3} xs={0}></Col>
            <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit" onSubmit={this.handleRegister}>
                <h3>Register New Account</h3>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter First Name'
                    value={this.state.firstName}
                    onChange={this.handleFirstName}
                  />

                  {this.state.firstNameError ? (

                    //displayes error if input is incorrect

                    <Form.Text className='input-error'>
                      {this.state.firstNameErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Last Name'
                    value={this.state.lastName}
                    onChange={this.handleLastName}
                  />
                  {this.state.lastNameError ? (

                    <Form.Text className='input-error'>
                      {this.state.lastNameErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Username'
                    value={this.state.username}
                    onChange={this.handleUsername}
                  />
                  {this.state.usernameError ? (
                    <Form.Text className='input-error'>
                      {this.state.usernameErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={this.state.email}
                    onChange={this.handleEmail}
                  />
                  {this.state.emailError ? (
                    <Form.Text className='input-error'>
                      {this.state.emailErrorMessage}
                    </Form.Text>
                  ) : null}
                  
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    value={this.state.password}
                    onChange={this.handlePassword}
                  />
                  {this.state.passwordError ? (
                    <Form.Text className='input-error'>
                      {this.state.passwordErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>

                <button className="btn-auth">
                  Register
                </button>
                <Form.Group className="mt-3">
                  <Form.Label>
                    Already Have An Account ?
                    <Link to='/login'> Login Here</Link>
                  </Form.Label>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
