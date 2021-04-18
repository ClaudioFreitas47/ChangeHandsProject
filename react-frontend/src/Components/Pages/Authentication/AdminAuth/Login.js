import React, { Component } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import axios from "axios";
import { apiRootUrl } from "./../../../appConfig";
import notification from "./../../../Alerts"
import VisitorNavbar from "./../../Visitor/VisitorNavbar";
import "./../../../../Assets/Styles/Main.css";

export default class AdminLogin extends Component {

  //sets all the values to empty or false

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailErrorMessage: "",
      passwordError: false,
      emailError: false,
      passwordErrorMessage: "",
    };
    
    //handles admin login
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  //handles the login for the admin account, validates email and password
  handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === "" || null) {
      this.setState({
        emailErrorMessage: "Please Enter Email",
        emailError: true,

      });

      return false;
    
    } else if (password === "" || null) {
      this.setState({
        passwordErrorMessage: "Please Enter Password",
        passwordError: true,
      });

    } else {

      //API post the admin details to DB to authenticate
      axios.post(apiRootUrl + "/admin/auth/login", this.state)

      //returns admin token and role and pushes user to admin page
        .then((res) => {
    
          localStorage.setItem("token_admin", res.data.token);
          localStorage.setItem("role", "admin");

          this.props.history.push("/admin");
        })
        //error messages displayed if error occurs
        .catch((err) => {
          notification("error", "Error", err.response.data.error)
        });
    }
  };
  //handles the admin pass
  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
      passwordError: false,
    });
  };
  //handles the admin email
  handleEmail = (e) => {
    this.setState({
      email: e.target.value,
      emailError: false,
    });
  };
  render() {
    return (
      <>
      <VisitorNavbar/>
      <div className="top"/>
        <Container>
          <Row>
            <Col lg={3} md={3} xs={0}></Col>
            <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit" onSubmit={this.handleLogin}>
                <h3>Admin Login</h3>
                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={this.state.email}
                    onChange={this.handleEmail}
                  />
                  {this.state.emailError ? (
                    //displays red text if email is incorrect 
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
                  Login
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
