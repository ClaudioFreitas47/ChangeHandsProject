import React, { Component } from "react";
import { Container, Col, Row, Form, Image } from "react-bootstrap";
import axios from "axios";
import UserNavbar from "./../Nav/UserNavbar";
import { apiRootUrl, apiRootFileUrl } from "./../../../appConfig";
import notification from "./../../../Alerts"
import "./../../../../Assets/Styles/Main.css";

export default class UserAccountSettings extends Component {

  //sets out all values for the account settings
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
      file: "",
      fileError: false,
      fileErrorMessage: "",
      profile: undefined,
      newPassword: "",
      newPasswordConfirm: "",
      newPasswordError: false,
      newPasswordErrorMessage: "",
      newPasswordConfirmError: false,
      newPasswordConfirmErrorMessage: "",
      contactNum: "",
      social: "",
      birthDate: "",
      gender: true,
      aboutMe: "",
    };

    //handles all of the user input settings
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleNewPassword = this.handleNewPassword.bind(this);
    this.handleNewPasswordConfirm = this.handleNewPasswordConfirm.bind(this);
    this.handleBasicAccountSetting = this.handleBasicAccountSetting.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.handleProfilePictureUpdate = this.handleProfilePictureUpdate.bind(this);
    this.handleProfileDetails = this.handleProfileDetails.bind(this);
  }
  //handles the details (used to submit the date, about me, contact, gender and socials)
  handleProfileDetails = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  //mounts user details, executed after first redner
  componentDidMount() {
    this.getUserDetails();
  }
  //API request to get all users details
  getUserDetails() {
    axios.get(apiRootUrl + "/auth/user", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      //returns all user data and sets in a setState
      .then((res) => {
        this.setState({
          email: res.data.data.email,
          profile: res.data.data.profile,
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          username: res.data.data.username,
          contactNum: res.data.data.contactNum,
          aboutMe: res.data.data.aboutMe,
          gender: res.data.data.gender,
          social: res.data.data.social,
          birthDate: res.data.data.birthDate,
        });
        //returns error message if any errors occured
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }
  //handles the profile picture update, if no file is uploaded an error appears
  handleProfilePictureUpdate = (e) => {
    e.preventDefault();
    const { file } = this.state;
    //file input validation
    if (file === "" || null) {

      this.setState({
        fileErrorMessage: "An Image Must Be Selected",
        fileError: true,
      });
      return;
    } else {


      //API call to get the users profile picture
      var formData = new FormData();
      formData.append("privateUpload", file);
      fetch(`${apiRootUrl}/uploads/privateUploads`, {
        method: "post",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      })
        .then((res) => res.json())

        .then((json) => {

          if (json.success) {
            //returns success message if picture is updated
            this.getUserDetails();
            notification("success", "Success", "Profile Image Has Been Updated");
          }
        })

        //returns error message if any issues occurred
        .catch((err) => {
          notification("error", "Error", err.response.data.error)
        });
    }
  };
  //handles the update of the password
  handleUpdatePassword = (e) => {
    e.preventDefault();
    const { password, newPassword, newPasswordConfirm } = this.state;

    //sets validation for the passwords
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
      //if no issues are encountered the new password is sent to the DB and updated
      const data = {
        password,
        newPassword,
      };
      //posts the new password to the DB
      axios.post(apiRootUrl + "/auth/updatePassword", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        },
      })
        //return success mesage
        .then((res) => {
          notification("success", "Success", res.data.message);

        })
        //returns if any errors occur
        .catch((err) => {
          console.log(err, err.response.data.error)
          notification("error", "Error", err.response.data.error)
        });

    }
  };

  //handles the uploading of the file and the change
  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileError: false,
    });
  };
  //handles the basic account settings such as the first name and last name
  //uses setState to set the state for errors
  handleBasicAccountSetting = (e) => {
    e.preventDefault();
    const { firstName, lastName } = this.state;
    //firstname input validation
    if (firstName === "") {
      this.setState({
        firstNameErrorMessage: "Please Enter First Name",
        firstNameError: true,
      });
      return false;
      //lastname input validation
    } else if (lastName === "") {
      this.setState({
        lastNameErrorMessage: "Please Enter Last Name",
        lastNameError: true,
      });
      return false;
    } else {

      //posts the new data to the DB
      axios.post(apiRootUrl + "/auth/updateProfile", this.state, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        //returns success message
        .then(() => {
          notification("success", "Success", "Profile Has Been Updated");
          //returns error message
        })
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
  handleUserName = (e) => {
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

  //handles the initial password
  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
      passwordError: false,
    });
  };

  //handles the new password
  handleNewPassword = (e) => {
    this.setState({
      newPassword: e.target.value,
      newPasswordError: false,
    });
  };
  //handles the confirmation of the new password
  handleNewPasswordConfirm = (e) => {
    this.setState({
      newPasswordConfirm: e.target.value,
      newPasswordConfirmError: false,
    });
  };

  render() {
    //forms used to handle all this.state
    return (
      <>
        <UserNavbar />
        <div className="table-top">
          <h2>Account Settings</h2>
        </div>
        <Container>
          <Row className="form-settings-bg">
            <Col lg={4} md={4} xs={12} >
              <Form className="form-edit" onSubmit={this.handleProfilePictureUpdate}>
                <h3>Change Profile Picture</h3>

                <Image
                  className='mt-4'
                  src={
                    this.state.profile === null
                      ? `${apiRootFileUrl}/standard-profile/standard-profile.png`
                      : `${apiRootFileUrl}/${this.state.profile}`
                  }
                  thumbnail
                  fluid
                />
                <Form.Group>
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control type='file' onChange={this.handleFileChange} />
                  {this.state.fileError ? (
                    <Form.Text className='input-error'>
                      {this.state.fileErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <button className="btn-view">
                  Change Profile Picture
                </button>
              </Form>
            </Col>
            <Col lg={4} md={4} xs={12} >

              <Form className="form-edit" onSubmit={this.handleBasicAccountSetting}>
                <h3>Edit Profile Details</h3>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter First Name'
                    value={this.state.firstName}
                    onChange={this.handleFirstName}
                  />
                  {this.state.firstNameError ? (
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
                    disabled='disabled'
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
                    disabled
                    placeholder='Enter email'
                    value={this.state.email}
                  />
                  {this.state.emailError ? (
                    <Form.Text className='input-error'>
                      {this.state.emailErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter a Contact Number'
                    name='contactNum'
                    value={this.state.contactNum}
                    onChange={this.handleProfileDetails}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Socials</Form.Label>
                  <Form.Control
                    type='text'
                    name='social'
                    placeholder='Enter Your Socials'
                    value={this.state.social}
                    onChange={this.handleProfileDetails}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as='select'
                    name='gender'
                    value={this.state.gender}
                    onChange={this.handleProfileDetails}
                  >
                    <option value={true}>Male</option>
                    <option value={false}>Female</option>

                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type='date'
                    name='birthDate'
                    value={this.state.birthDate}
                    onChange={this.handleProfileDetails}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>About Me</Form.Label>
                  <Form.Control
                    as='textarea'
                    placeholder='Enter Your About'
                    value={this.state.aboutMe}
                    name='aboutMe'
                    onChange={this.handleDetails}
                  />
                </Form.Group>

                <button className="btn-view">
                  Update Details
                </button>
              </Form>
            </Col>
            <Col lg={4} md={4} xs={12}
            >
              <Form className="form-edit" onSubmit={this.handleUpdatePassword}>
                <h3>Change Password</h3>

                <Form.Group>
                  <Form.Label>Current Password</Form.Label>
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
        <div className="bottom"></div>
      </>
    );
  }
}
