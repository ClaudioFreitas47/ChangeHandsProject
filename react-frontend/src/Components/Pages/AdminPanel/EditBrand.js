import React, { Component } from "react";
import { Container, Row, Col, Form} from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl } from "./../../appConfig";
import notification from "./../../Alerts"

export default class AdminEditBrand extends Component {

  //sets all values to empty or false
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      brandNameErrorMessage: "",
      brandNameError: false,
      id: undefined,
    };

    this.handleName = this.handleName.bind(this);
    this.handleEditBrand = this.handleEditBrand.bind(this);
  }

  //handles the new name of the brand
  handleName = (e) => {
    this.setState({
      name: e.target.value,
      brandNameError: false,
    });
  };
  //executed after first render
  componentDidMount() {
    if (this.props.match.params.id) {
      this.setState({
        id: this.props.match.params.id,
      });
      this.getBrandDetails(this.props.match.params.id);
    } else {
    }
  }

  //API gets the brand data using the ID
  getBrandDetails = (brandId) => {
    axios.get(apiRootUrl + `/admin/brands/getSingleBrand?id=${brandId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })

    //responds with the brand name and ID
      .then((res) => {
        this.setState({
          name: res.data.data.name,
          id: res.data.data._id,
        });
      })
      //returns any errors 
      .catch((err) => {

        notification("error", "Error", err.response.data.error)
      });
  };

  //handles the brand validation
  handleEditBrand = (e) => {
    e.preventDefault();
    const { name } = this.state;
    if (name === "" || null) {
      this.setState({
        brandNameErrorMessage: "Add In A Brand Name",
        brandNameError: true,
      });
      return false;
    } else {
      //API Posts the updated brand to the DB
      axios.post(apiRootUrl + "/admin/brands/updateBrand", this.state, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      })
//Returns success message and pushes user to all-brands
        .then(() => {
 
          notification("success", "Success", "Brand Name Has Been Updated");
          this.props.history.push("/admin/all-brands");
        })

        //catches any errors and displays alert
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
          <Col lg={4} md={4} xs={12}></Col>
          <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit" onSubmit={this.handleEditBrand}>
                <h3>Update Brand</h3>
                <Form.Group>
                  <Form.Label>Brand Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter new name'
                    value={this.state.name}
                    onChange={this.handleName}
                  />
                  {/*Displays error under text */}
                  {this.state.brandNameError ? (
                    <Form.Text className='input-error'>
                      {this.state.brandNameErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <button className="btn-edit">
                  Update Brand
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
