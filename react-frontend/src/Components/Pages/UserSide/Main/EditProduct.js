import React, { Component } from "react";
import UserNavbar from "./../Nav/UserNavbar";
import { Container, Col, Row, Form } from "react-bootstrap";
import axios from "axios";
import { apiRootUrl,} from "./../../../appConfig";
import notification from "./../../../Alerts"


export default class EditProduct extends Component {

  //props for all the edit product options
  //all options set to empty or null
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

    //handles editing of products
    this.handleName = this.handleName.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleCondition = this.handleCondition.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleBrand = this.handleBrand.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
  
  }
  //handles the size of the product
  handleSize = (e) => {
    this.setState({
      size: e.target.value,
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
  //handles the category of the product
  handleCategory = (e) => {
    this.setState({
      category: e.target.value,
    });
  };
  //handles the price of the product 
  handlePrice = (e) => {
    this.setState({
      price: e.target.value,
    });
  };
//executed after first render
  componentDidMount() {
    //gets all the product details if the props match
    if (this.props.match.params.id) {
      this.setState({
        id: this.props.match.params.id,
      });
      this.getAllCategories();
      this.getProductDetails(this.props.match.params.id);
    } else {
    }
  }

  //API request to get all the categories
  getAllCategories() {
    axios.get(apiRootUrl + "/products/allCategories", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
      //returns the data
        this.setState({
          categories: res.data.data,
          brands: res.data.brands,
        });
      })
      //returns error if an issue is encountered
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }

  //API request to get the single product using the ID 
  getProductDetails = (productId) => {
    
    axios.get(apiRootUrl + `/products/getSingleProduct?productId=${productId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    //the response then sets all the paramaters with the product details
      .then((res) => {
 
        //sets state with product details
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
      //error message displayed
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
    });
  };

  //Handles the editing of the product
  //if statements used to present errors for incorrect input
  handleEditProduct = (e) => {
    e.preventDefault();
    //input validation
    const { file, price, name, description } = this.state;
    if (price < 1 || name === "" || description === "") {
      
      //returns error 
      notification("error", "Error", "All Fields Must Be Filled In!")

      return false;
    }
    //if statement for the file upload
    if (file !== "") {
      var formData = new FormData();
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

           //posts the API update product root
                axios.post(apiRootUrl + "/products/updateProduct ", this.state, {
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                })

                //return success message if successfull and pushes user to their products
                  .then((res) => {
                    console.log(res)

                    //returns error
                    notification("success", "Success", "Product Has Been Updated");

                    this.props.history.push("/my-products");
                  })
                  //presents the user with error messages
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

        //posts the updated product to the DB
    } else {

      axios.post(apiRootUrl + "/products/updateProduct ", this.state, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      //returns success message and pushes to my products page
        .then(() => {
          
            notification("success", "Success", "Product Has Been Updated")
          
          //push to /my-products
          this.props.history.push("/my-products");
        })

        .catch((err) => {
          notification("error", "Error", err.response.data.error)

        });
    }
  };
  //handles the name of the product
  handleName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  //handles the description of the product
  handleDescription = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  //handles the file upload of the product
  handleFileUpload = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      file: e.target.files[0],
    });
  };

  render() {
    
    return (
      <>

        <UserNavbar />
        <div className="top"/>
        <Container>
          <Row>
            <Col lg={2} md={2} xs={0}></Col>
            <Col lg={8} md={8} xs={12} className='form-bg'>
              {/*Forms used to submit user data to DB */}
              {/*.Map used to present each item in the array */}
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
