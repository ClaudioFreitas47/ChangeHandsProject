import React, { Component } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl } from "../../appConfig";
import notification from "./../../Alerts"

export default class AdminAccountSettings extends Component {

  //sets all value to empty or false
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordError: false,
      passwordErrorMessage: "",
      newPassword: "",
      newPasswordConfirm: "",
      newPasswordError: false,
      newPasswordErrorMessage: "",
      newPasswordConfirmError: false,
      newPasswordConfirmErrorMessage: "",
    };

    this.handlePassword = this.handlePassword.bind(this);
    this.handleNewPassword = this.handleNewPassword.bind(this);
    this.handleNewPasswordConfirm = this.handleNewPasswordConfirm.bind(this);

    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }
//handles updating the password
  handleUpdatePassword = (e) => {
    e.preventDefault();
    const { password, newPassword, newPasswordConfirm } = this.state;
    if (password === "" || null) {
      this.setState({
        passwordError: true,
        passwordErrorMessage: "Current Password Required",
      });
    } else if (newPassword === "" || null) {
      this.setState({
        newPasswordError: true,
        newPasswordErrorMessage: "New Password Required",
      });
    } else if (newPassword === "" || null) {
      this.setState({
        newPasswordError: true,
        newPasswordErrorMessage: `Password must contain the following:
        Uppercase and lowercase characters, 
        Any digit character (0-9)
        Atleast 8 characters in length.`,
      });
    } else if (newPassword !== newPasswordConfirm) {
      this.setState({
        newPasswordConfirmError: true,
        newPasswordConfirmErrorMessage:
        "New Passwords Do Not Match",
      });
    } else {
      const data = {
        password,
        newPassword,
      };

      //API posts the updated password
      axios.post(apiRootUrl + "/admin/auth/updatePassword", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      })
        .then((res) => {
          notification("success", "Success", res.data.message);
        })
        .catch((err) => {
          notification("error", "Error", err.response.data.error)
        });
  
    }
  };

  //handles the new password
  handleNewPassword = (e) => {
    this.setState({
      newPassword: e.target.value,
      newPasswordError: false,
    });
  };

  //handles the confirmation of new password
  handleNewPasswordConfirm = (e) => {
    this.setState({
      newPasswordConfirm: e.target.value,
      newPasswordConfirmError: false,
    });
  };

  //handles the current password
  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
      passwordError: false,
    });
  };

  render() {
    return (
      <>
        <AdminNavBar />
<div className="top"/>
        <Container>
          <Row>
            <Col lg={4} md={4} xs={12}></Col>
            <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit" onSubmit={this.handleUpdatePassword}>
                <h3>Change Password</h3>

                <Form.Group>
                  <Form.Label>Old Password</Form.Label>
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
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    value={this.state.newPassword}
                    onChange={this.handleNewPassword}
                  />
                  {this.state.newPasswordError ? (
                    <Form.Text className='input-error'>
                      {this.state.newPasswordErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    value={this.state.newPasswordConfirm}
                    onChange={this.handleNewPasswordConfirm}
                  />
                  {this.state.newPasswordConfirmError ? (
                    <Form.Text className='input-error'>
                      {this.state.newPasswordConfirmErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>

                <button className="btn-view">
                  Change Password
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
