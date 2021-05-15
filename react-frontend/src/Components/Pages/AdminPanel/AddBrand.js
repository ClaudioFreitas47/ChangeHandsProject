import React, { Component } from "react";
import { Form, Row, Container, Col } from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl } from "./../../appConfig";
import notification from "./../../Alerts"


export default class AdminAddBrand extends Component {

  //sets all values to empty or false
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      brandNameErrorMessage: "",
      brandNameError: false,
    };
    this.handleBrandName = this.handleBrandName.bind(this);

    this.handleAddBrand = this.handleAddBrand.bind(this);
  }

  //handles the name of the brand
  handleBrandName = (e) => {
    this.setState({
      name: e.target.value,
      brandNameError: false,
    });
  };

  //handles creating a new brand
  handleAddBrand = (e) => {
    //prevents it from happening unless button is pressed
    e.preventDefault();
    const { name } = this.state;
    if (name === "" || null) {
      this.setState({
        brandNameErrorMessage: "Please Add Brand Name",
        brandNameError: true,
      });
      return false;
    } else {

//API post of new brand name to DB
      axios.post(apiRootUrl + "/admin/brands/createBrand", this.state, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      })
//returns success message
        .then((res) => {
          console.log(res);
          notification("success", "Success", "Brand Has Been Added");
          this.props.history.push("/admin/all-brands");
        })
        .catch((err) => {
          notification("error", "Error", err.response.data.error)
        });
    }
  };
  render() {
    return (
      <>
        <AdminNavBar />
        <div className="top"/>
        <Container>
          <Row>
            <Col lg={4} md={4} xs={0}></Col>
            <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit" onSubmit={this.handleAddBrand}>
                <h3>Add Brand</h3>
                <Form.Group>
                  <Form.Label>Brand Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={this.state.name}
                    onChange={this.handleBrandName}
                  />
                  {this.state.brandNameError ? (
                    <Form.Text className='input-error'>
                      {this.state.brandNameErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <button className="btn-view">
                  Add Brand
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
        <div className="bottom"/>
      </>
    );
  }
}
