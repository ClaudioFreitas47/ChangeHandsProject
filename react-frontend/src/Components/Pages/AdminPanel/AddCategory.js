import React, { Component } from "react";
import { Container, Row, Form, Col} from "react-bootstrap";
import AdminNavBar from "./Nav/AdminNavbar";
import axios from "axios";
import { apiRootUrl } from "./../../appConfig";
import notification from "./../../Alerts"

export default class AdminAddCategory extends Component {

  //sets all values to empty or false
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      categoryNameErrorMessage: "",
      categoryNameError: false,
    };
    this.handleCategoryName = this.handleCategoryName.bind(this);

    this.handleAddCategory = this.handleAddCategory.bind(this);
  }

  //handles the name of the category
  handleCategoryName = (e) => {
    this.setState({
      name: e.target.value,
      categoryNameError: false,
    });
  };

  //handles adding in a new category
  handleAddCategory = (e) => {
    e.preventDefault();
    const { name } = this.state;
    if (name === "" || null) {
      this.setState({
        categoryNameErrorMessage: "Please Add Category Name",
        categoryNameError: true,
      });
      return false;
    } else {
  
      //sends new name of category to DB
      axios.post(apiRootUrl + "/admin/categories/createCategory", this.state, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      })

        .then((res) => {
          console.log(res);
          notification("success", "Success", "Category Has Been Added");
          this.props.history.push("/admin/all-categories");
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
              <Form className="form-edit" onSubmit={this.handleAddCategory}>
                <h3>Add Category</h3>
                <Form.Group>
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={this.state.name}
                    onChange={this.handleCategoryName}
                  />
                  {this.state.categoryNameError ? (
                    <Form.Text className='input-error'>
                      {this.state.categoryNameErrorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <button  className="btn-view">
                  Add Category
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
