import React, { Component } from "react";
import AdminNavBar from "./Nav/AdminNavbar";
import { Container, Col, Row, Form } from "react-bootstrap";
import axios from "axios";
import { apiRootUrl } from "../../appConfig";
import notification from "./../../Alerts"

export default class AdminEditProduct extends Component {

  //sets all values to empty or null
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: 0,
      image: undefined,
      file: "",
      id: undefined,
      categories: [],
      category: undefined,
      brand: undefined,
      brands: [],
      condition: "",
      size: "N/a",
      sizes: [
        { value: "N/a", lable: "N/a"},
        { value: "XS", lable: "Extra Small" },
        { value: "S", lable: "Small" },
        { value: "M", lable: "Medium" },
        { value: "L", lable: "Large" },
        { value: "XL", lable: "Extra Large" },
      ],
    };
    this.handleBrand = this.handleBrand.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleCondition = this.handleCondition.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
  }

  //handles product size
  handleSize = (e) => {
    this.setState({
      size: e.target.value,
    });
  };

  //handles product condition
  handleCondition = (e) => {
    this.setState({
      condition: e.target.value,
    });
  };

  //handles product brand
  handleBrand = (e) => {
    this.setState({
      brand: e.target.value,
    });
  };

  //handles product category
  handleCategory = (e) => {
    this.setState({
      category: e.target.value,
    });
  };

  //handles product price
  handlePrice = (e) => {
    this.setState({
      price: e.target.value,
    });
  };
//executed after first render
  componentDidMount() {
    if (this.props.match.params.id) {
      this.setState({
        id: this.props.match.params.id,
      });
      this.getAllCategories();
      this.getProductDetails(this.props.match.params.id);
    } else {
    }
  }

  //API get all categories from DB
  getAllCategories() {
    axios.get(apiRootUrl + "/admin/categories/getAllCategories", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    })
    //returns success message
      .then((res) => {
        this.setState({
          categories: res.data.data,
          brands: res.data.brands,
        });
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }

  getProductDetails = (productId) => {
//API Get product details from DB using product ID
    axios.get(
      apiRootUrl + `/admin/products/getSingleProduct?productId=${productId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      }
    )
      .then((res) => {
//responds with product details
        this.setState({
          id: res.data.data._id,
          name: res.data.data.name,
          image: res.data.data.image,
          description: res.data.data.description,
          price: res.data.data.price,
          condition: res.data.data.condition,
          brand: res.data.data.brand._id,
          size: res.data.data.size,
          category: res.data.data.category._id,
        });
      })
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  };
  //handles the editing of product, if fields are empty returns error
  handleEditProduct = (e) => {
    e.preventDefault();
    const { file, price, name, description } = this.state;
    if (price < 1 || name === "" || description === "") {
      notification("error", "Error", "All Fields Must Be Filled In")
      return false;
    }
    //if no file returns error
    if (file !== "") {
      let formData = new FormData();
      formData.append("publicUpload", file);
      fetch(`${apiRootUrl}/uploads/publicUploads`, {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => {
   
          if (json.success) {
            this.setState(
              {
                image: json.data,
              },
              () => {
//API Posts updated product to DB
                axios.post(
                  apiRootUrl + "/admin/products/updateProduct",
                  this.state,
                  {
                    headers: {
                      Authorization:
                        "Bearer " + localStorage.getItem("token_admin"),
                    },
                  }
                )
                //pushes admin to all products
                  .then(() => {
                    //uses props to push admin to all products
                      notification("success", "Success", "Product Has Been Updated");
                    this.props.history.push("/admin/all-products");
                  })
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
    } else {
//API post to update admin product
      axios.post(apiRootUrl + "/admin/products/updateProduct", this.state, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      })
      //pushes admin to all products
        .then(() => {
          notification("success", "Success", "Product Has Been Updated");
          this.props.history.push("/admin/all-products");
        })
        .catch((err) => {
          notification("error", "Error", err.response.data.error)
        });
    }
  };

  //handles the product name
  handleName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  //handles the product description
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
    return (
      <>
        <AdminNavBar />
        <div className="top"/>
        <Container>
          <Row>
          <Col lg={4} md={4} xs={12}></Col>
          <Col lg={6} md={6} xs={12} className='form-bg' >
              <Form className="form-edit" onSubmit={this.handleEditProduct}>
                <h3>Edit Product</h3>
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Name'
                    value={this.state.name}
                    onChange={this.handleName}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Price'
                    value={this.state.price}
                    onChange={this.handlePrice}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Product Condition</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Product Condition'
                    value={this.state.condition}
                    onChange={this.handleCondition}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    placeholder='Enter Description'
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
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control type='file' onChange={this.handleFileUpload} />
                </Form.Group>
                <button className="btn-view">
                  Update Product
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
