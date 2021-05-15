import React, { Component } from "react";
import UserNavbar from "./../Nav/UserNavbar";
import { Container, Col, Row, Form } from "react-bootstrap";
import axios from "axios";
import { apiRootUrl } from "./../../../appConfig";
import notification from "./../../../Alerts"
import "./../../../../Assets/Styles/Main.css";

export default class AddProduct extends Component {
  
  //props for the product details (sets all the values)
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: 0,
      image: undefined,
      file: "",
      categories: [],
      brands: [],
      category: undefined,
      brand: undefined,
      condition: "",
      size: "N/a",
      sizes: [
        { value: "N/a", lable: "N/a" },
        { value: "XS", lable: "Extra Small" },
        { value: "S", lable: "Small" },
        { value: "M", lable: "Medium" },
        { value: "L", lable: "Large" },
        { value: "XL", lable: "Extra Large" },
      ],
    };

    //handles the upload of products
    this.handleName = this.handleName.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleCondition = this.handleCondition.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleBrand = this.handleBrand.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleAddProduct = this.handleAddProduct.bind(this);
  }
  //handles the size of the product
  handleSize = (e) => {
    this.setState({
      size: e.target.value,
    });
  };
  //handles the category of the product
  handleCategory = (e) => {
    this.setState({
      category: e.target.value,
    });
  };
  //handles the condition of the product
  handleCondition = (e) => {
    this.setState({
      condition: e.target.value,
    });
  };
  //handles the brand of the product
  handleBrand = (e) => {
    this.setState({
      brand: e.target.value,
    });
  };
  //executed after first render
  componentDidMount() {
    this.getAllCategories();
  }
  //API request to get all the categories
  getAllCategories() {
    axios.get(apiRootUrl + "/products/allCategories", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    //returns data result
      .then((res) => {
        console.log(res);
        this.setState(
          {
            categories: res.data.data,
            brands: res.data.brands,
          },
          () => {
            if (this.state.categories.length > 0) {
              this.setState({
                category: this.state.categories[0]._id,
              });
            }
          }
        );
      })
      //returns error alert if erros are found
      .catch((err) => {
        notification("error", "Error", err.response.data.error)

      });
  }

  //handles the price of the product
  handlePrice = (e) => {
    this.setState({
      price: e.target.value,
    });
  };

  //handles the function of adding the new product
  handleAddProduct = (e) => {
    e.preventDefault();
    //if the fields are non existant an error message is presented
    const { file, price, name, description } = this.state;
    if (file === "" || price < 1 || name === "" || description === "") {
     
      //returns error alert
      notification("error", "Error", "All Fields Must Be Filled In")

      return false;
    }
    
    //API for the file upload
    var formData = new FormData();
    formData.append("publicUpload", file);
    fetch(`${apiRootUrl}/uploads/publicUploads`, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          this.setState(
            {
              image: json.data,
            },
            //posts API to create the new product and returns success mesage
            () => {
              axios.post(apiRootUrl + "/products/createProduct ", this.state, {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              })
                .then(() => {
                  notification("success", "Success", "Item has been uploaded");

                  this.props.history.push("/my-products");
                })
                //error message if any issues
                .catch((err) => {

                 notification("error", "Error", err.response.data.error)
                });
            }
          );
        }
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  };
  //handles the name of the product
  handleName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  //handles the description of the produuct
  handleDescription = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  //handles the file upload
  handleFileUpload = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      file: e.target.files[0],
    });
  };


  render() {
    //.map is used to display all items within the array
    return (
      <>
        <UserNavbar />
        <div className="top"/>
        <Container>
          <Row>
            <Col lg={2} md={2} xs={0}></Col>
            <Col lg={8} md={8} xs={12} className='form-bg'>
              <Form className="form-edit" onSubmit={this.handleAddProduct}>
                <h3>Add Product</h3>
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Product Name'
                    value={this.state.name}
                    onChange={this.handleName}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Product Price'
                    value={this.state.price}
                    onChange={this.handlePrice}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Product Condition</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Product Condition'
                    value={this.state.condition}
                    onChange={this.handleCondition}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    placeholder='Enter Product Description'
                    value={this.state.description}
                    onChange={this.handleDescription}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Choose Product Size</Form.Label>
                  <Form.Control
                    as='select'
                    value={this.state.size}
                    onChange={this.handleSize}
                  >
                    {this.state.sizes.map((size) => {
                      return (
                        <option key={size.lable} value={size.value}>
                          {size.lable}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Choose Product Category</Form.Label>
                  <Form.Control
                    as='select'
                    value={this.state.category}
                    onChange={this.handleCategory}
                  >
                    {this.state.categories.map((category) => {
                      return (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Choose Product Brand</Form.Label>
                  <Form.Control
                    as='select'
                    value={this.state.brand}
                    onChange={this.handleBrand}
                  >
                    {this.state.brands.map((brand) => {
                      return (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control type='file' onChange={this.handleFileUpload} />
                </Form.Group>         
                <button className='btn-view'>
                                Add Product
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
