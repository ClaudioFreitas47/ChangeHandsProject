import React, { Component } from "react";
import { Container, Row, Col, Form} from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl } from "./../../appConfig";
import notification from "./../../Alerts"

export default class AdminEditCategory extends Component {

  constructor(props) {

    //sets all values to empty or false
    super(props);
    this.state = {
      name: "",
      categoryNameErrorMessage: "",
      categoryNameError: false,
      id: undefined,
    };

    this.handleName = this.handleName.bind(this);
    this.handleEditCategory = this.handleEditCategory.bind(this);
  }

  //handles the category name
  handleName = (e) => {
    this.setState({
      name: e.target.value,
      categoryNameError: false,
    });
  };
  componentDidMount() {
    if (this.props.match.params.id) {
      this.setState({
        id: this.props.match.params.id,
      });
      this.getCategoryDetails(this.props.match.params.id);
    } else {
    }
  }

  //gets tthe categorys name and ID using the catID
  getCategoryDetails = (categoryId) => {
    axios.get(
      apiRootUrl + `/admin/categories/getSingleCategory?id=${categoryId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      }
    )
      .then((res) => {
        this.setState({
          name: res.data.data.name,
          id: res.data.data._id,
        });
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  };

  //Handles the Validation for updating the category
  handleEditCategory = (e) => {
    e.preventDefault();
    const { name } = this.state;
    if (name === "" || null) {
      this.setState({
        categoryNameErrorMessage: "Add In A Category Name",
        categoryNameError: true,
      });
      return false;
    } else {
      
      //API Post to update the category with the new name
      axios.post(apiRootUrl + "/admin/categories/updateCategory", this.state, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      })
//pushes admin to all categories page if successful
        .then(() => {
      
         notification("success", "Success", "Category Has Been Updated");
          this.props.history.push("/admin/all-categories");
        })

        //present error alert
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
              <Form className="form-edit" onSubmit={this.handleEditCategory}>
                <h3>Update Category</h3>
                <Form.Group>
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={this.state.name}
                    onChange={this.handleName}
                  />
                  {this.state.categoryNameError ? (
                    <Form.Text className='input-error'>
                      {this.state.categoryNameErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <button className="btn-edit">
                  Update Category
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
