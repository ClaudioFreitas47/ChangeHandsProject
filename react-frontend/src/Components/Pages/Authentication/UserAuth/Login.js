import React, { Component } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import axios from "axios";
import { apiRootUrl } from "./../../../appConfig";
import notification from "./../../../Alerts"
import { Link } from "react-router-dom";
import VisitorNavbar from "./../../Visitor/VisitorNavbar";
import "./../../../../Assets/Styles/Main.css"

export default class Login extends Component {

  //sets all the values to empty or false
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameErrorMessage: "",
      passwordError: false,
      usernameError: false,
      passwordErrorMessage: "",
    };
    //handles the login for the user
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  //handles the login, makes sure all fields are validated
  handleLogin = (e) => {
    e.preventDefault();

    const { username, password } = this.state;

    if (username === "" || null) {
      this.setState({
        usernameErrorMessage: "Please Enter A Username",
        usernameError: true,
      });

      return false;

    } else if (password === "" || null) {

      this.setState({
        passwordErrorMessage: "Please Enter A Password",
        passwordError: true,
      });

    } else {
    
      //API post to login user if no errors occur
      axios.post(apiRootUrl + "/auth/login", this.state)

        .then((res) => {
  //sets the token as the data response
          const { token } = res.data;
          //gets the users authentication
          axios.get(apiRootUrl + "/auth/user", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
//sets the second response with all of the users details
            .then((res_get) => {
              console.log("this is res_get", res_get)
              localStorage.setItem("token", token);
              localStorage.setItem("email", res_get.data.data.email);
              localStorage.setItem("profile", res_get.data.data.profile);
              localStorage.setItem("firstName", res_get.data.data.firstName);
              localStorage.setItem("lastName", res_get.data.data.lastName);
              localStorage.setItem("role", "user");
              localStorage.setItem("username", res_get.data.data.username);
              localStorage.setItem("id", res_get.data.data._id);
//props.history pushes the user to the homepage
              this.props.history.push("/home");
            })
            //displays any errors if they occur
            .catch((err) => {
              notification("error", "Error", err.response.data.err)
            });

        })
        .catch((err) => {
          notification("error", "Error", err.response.data.error)
        });
    }
  };

   //handles the username for logging in
   handleUsername = (e) => {
    this.setState({
      username: e.target.value,
      usernameError: false,
    });
  };

  //handles the users password
  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
      passwordError: false,
    });
  };

  //renders the HTML and CSS
  render() {
    return (
      <>
        <VisitorNavbar />
        <div className="top"/>
        <Container>
          <Row>
            <Col lg={3} md={3} xs={0}></Col>
            <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit"onSubmit={this.handleLogin}>
                <h3>Login</h3>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Username'
                    value={this.state.username}
                    onChange={this.handleUsername}
                  />
                
                  {this.state.usernameError ? (
                    //displays error message in red text under field
                    <Form.Text className='input-error'>
                      {this.state.usernameErrorMessage}
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
                <Form.Group>
                  <Form.Label>
                    Don't Have An Account ?
                    <Link to='/register'> Register Here</Link>
                  </Form.Label>
                </Form.Group>
                <Form.Group>
                <Form.Label>
                    <Link to='/admin/login'> Admin Login</Link>
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
