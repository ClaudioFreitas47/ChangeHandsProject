import React, { Component } from "react";
import UserNavbar from "../Nav/UserNavbar";
import VisitorNavbar from "../../Visitor/VisitorNavbar";
import {FaSearch} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Container,
  Col,
  Row,
  Form,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import { apiRootUrl, apiRootFileUrl, } from "../../../appConfig";
import notification from "../../../Alerts"
import "./../../../../Assets/Styles/Main.css";

export default class ProductDashboard extends Component {

//sets out all the data result for each item, set to empty
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      searchWord: "",
      sortPrice: "",
      brands: [],
      searchedExists: false,
      categories: [],
      category: undefined,
      brand: undefined,
      brandChecked: false,
      categoryCChecke: false,
      sizeChecked: false,
      size: "Size",
      sizes: [
        { value: "N/a", lable: "N/a" },
        { value: "XS", lable: "Extra Small" },
        { value: "S", lable: "Small" },
        { value: "M", lable: "Medium" },
        { value: "L", lable: "Large" },
        { value: "XL", lable: "Extra Large" },
      ],
    };

    //handles product dashboard 
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchWord = this.handleSearchWord.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleBrand = this.handleBrand.bind(this);
    this.handleSize = this.handleSize.bind(this);
  }
  //handles if the brand is selected for the advanced search
  handleBrand = (e) => {
    if (e.target.value === "" || null) {
      //sets the brands state to false
      this.setState(
        {
          brand: e.target.value,
          brandChecked: false,
        },
        () => {
          this.handleAdvanceSearch();
        }
      );
    } else {

      //sets the brands state to true
      this.setState(
        {
          brand: e.target.value,
          brandChecked: true,
        },
        () => {
          this.handleAdvanceSearch();
        }
      );
    }
  };
  //handles if the size is selected for the advanced search menu 
  handleSize = (e) => {
    if (e.target.value === "" || null) {

      //sets the brands state to false
      this.setState(
        {
          size: e.target.value,
          sizeChecked: false,
        },
        () => {
          this.handleAdvanceSearch();
        }
      );
    } else {

      //sets the brands state to true
      this.setState(
        {
          size: e.target.value,
          sizeChecked: true,
        },
        () => {
          this.handleAdvanceSearch();
        }
      );
    }
  };
//if any of the advanced search options are selected it sorts out the items depending on the item selected
  handleAdvanceSearch = () => {
    let url = "";
    const {  
      category,
      brand,
      brandChecked,
      categoryChecked,
      sizeChecked,
      size,
    } = this.state;

    //if the category is checked it selects the category for that item, same with brand and size
    if (categoryChecked) {
      url += `&category=${category}`;
    }
    if (brandChecked) {
      url += `&brand=${brand}`;
    }
    if (sizeChecked) {
      url += `&size=${size}`;
    }
    //sorts of the price for the item
    url = url.substring(1);
    let data = {
      sortPrice: this.state.sortPrice,
    };
    //sets the url depending on the data selected
    this.getAdvanceSearchedProducs(
      `/products/getAdvanceSearchedProducts?${url}`,
      data
    );
  };
  //handles if the category is selected for the advanced search
  handleCategory = (e) => {

    if (e.target.value === "" || null) {

      //sets the state of the category to false
      this.setState(
        {
          category: e.target.value,
          categoryChecked: false,
        },
        () => {
          this.handleAdvanceSearch();
        }
      );
    } else {

      //sets the state of the category to true
      this.setState(
        {
          category: e.target.value,
          categoryChecked: true,
        },
        () => {
          this.handleAdvanceSearch();
        }
      );
    }
  };

//API request to get all the categories, uses user auth token
  getAllCategories() {
    axios.get(apiRootUrl + "/products/allCategories", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    //returns the results
      .then((res) => {
        //sets the state with the category and brand data
        this.setState({
          categories: res.data.data,
          brands: res.data.brands,
        });
      })
      //displays if any errors occur
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }
  //handles the clear search option that returns the user back to the page
  handleClear = (e) => {
    e.preventDefault();
    //clear returns user to all products page
    this.getAllProducts("/products/getAllProducts");
  };

  //handles the search word
  handleSearchWord = (e) => {
    //sets the state with the users search input
    this.setState({
      searchWord: e.target.value,
    });
  };

  //handles the search using the users search word and gets the item result from it
  handleSearch = (e) => {
    e.preventDefault();
    //the search word is the state
    const { searchWord } = this.state;

    //if search word doesnt equal an empty string it returns product based on the search word
    if (searchWord !== "") {
      this.getSearchedProducts(searchWord);
    }
  };
  //API request to get the item the user has searched for. Uses auth token
  getSearchedProducts = (searchWord) => {
    axios.get(apiRootUrl + `/products/searchProduct?searchWord=${searchWord}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
//returns the product that  the user searched for
      .then((res) => {
        
        //sets the state to true
        this.setState({
          products: res.data.data,
          searchedExists: true,
        });
      })
      //returns error messgage if any issues encountered with API 
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  };

  //API request to post the advanced search options, uses user auth token
  getAdvanceSearchedProducs = (url, data) => {
    axios.post(apiRootUrl + url, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })

      .then((res) => {
//returns the data and sets the state to false and empty
        this.setState({
          products: res.data.data,
          searchedExists: false,
          searchWord: "",
        });
      })

      //returns an error result
      .catch((err) => {

        notification("error", "Error", err.response.data.error)

      });
  };

  //API request to get all the products uses user AUTH token
  getAllProducts = (url) => {
    axios.get(apiRootUrl + url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
//returns the products
      .then((res) => {
        
        //sets the state to false
        this.setState({
          products: res.data.data,
          searchedExists: false,
          searchWord: "",
        });
      })
      //returns error alert if errors occured
      .catch((err) => {
        
        notification("error", "Error", err.response.data.error)
      });
  };
  //gets all the products
  componentDidMount() {
    this.getAllCategories();
    this.getAllProducts("/products/getAllProducts");
  }

  render() {
    const token = localStorage.getItem("token");
    return (
      <>
      {/*If user isnt authenticated the Visitor Nav appears */}
      {/*Bootstrap styles and elements used to structure page */}
        {token ? <UserNavbar /> : <VisitorNavbar />}
        <div className="table-top">
          <h2>Find Products</h2>
        </div>
        <Container>
          <Row className='mb-5'>
            <Col md={12} sm={12} lg={12} xs={12}>
              {/*Form used for the search option*/}
              <Form
                className='d-flex justify-content-center'
                inline
                onChange={this.handleSearch}
              >
                <FormControl
                  style={{ minWidth: "75%" }}
                  type='text'
                  value={this.state.searchWord}
                  onChange={this.handleSearchWord}
                  placeholder='Search For Products'
                  className='mr-3'
                />
                <button className="btn-search">
                  <FaSearch />
                </button>
              </Form>
            </Col>
          </Row>
          {this.state.searchedExists ? (
            <Row>
              <Col md={12}>
                <p className='text-center'>
                  <strong className='mr-2'>{this.state.products.length}</strong>
                  Products Found Matching "{this.state.searchWord}"
                </p>
                
              </Col>
            </Row>
          ) : null}

          <Row>
            <Col md={9} sm={12}>
              <div>
                <Form.Group className='menu'>
                  <div className='select'>
                    <Form.Control
                      size='sm'
                      as='select'
                      value={this.state.category}
                      onChange={this.handleCategory}
                    >
                      <option value=''> Category</option>
                      {/*Maps out all the categories into the categories option */}
                      {this.state.categories.map((category) => {
                        return (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <Form.Control
                      size='sm'
                      as='select'
                      value={this.state.brand}
                      onChange={this.handleBrand}
                    >
                      <option value=''> Brand</option>
                      {/*Maps out all the brand into the brands option */}
                      {this.state.brands.map((brand) => {
                        return (
                          <option key={brand._id} value={brand._id}>
                            {brand.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    <Form.Control
                      size='sm'
                      as='select'
                      value={this.state.size}
                      onChange={this.handleSize}
                    >
                      <option value=''> Size</option>
                      {/*Maps out all the sizes into the size option */}
                      {this.state.sizes.map((size) => {
                        return (
                          <option key={size.lable} value={size.value}>
                            {size.lable}
                          </option>
                        );
                      })}
                    </Form.Control>

                    <Form.Control
                    //sets the state to sort the price
                      value={this.state.sortPrice}
                      onChange={(e) => {
                        this.setState(
                          {
                            sortPrice: e.target.value,
                          },
                          () => {
                            this.handleAdvanceSearch();
                          }
                        );
                      }}
                      size='sm'
                      as='select'
                    >
                      {/*Sets out the price sorting options*/}
                      <option value=''>Price</option>
                      <option value='1'>Low-High</option>
                      <option value='-1'>High-Low</option>
                    </Form.Control>
                  </div>
                  <div className='d-flex ml-5'>
                  </div>
                </Form.Group>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={12}>
              <div className='product-item mt-5'>
                {/*Maps out all the products onto the page, this includes name, image and price */}
                {this.state.products.map((product) => {
                  return (
                    <div className='d-flex flex-column'>
                      <strong className='mb-2'>{product.name}</strong>
                      <img
                        src={`${apiRootFileUrl}/${product.image}`}
                        height='160'
                        width='160'
                        alt='user product image'
                      />
                      
                      <strong>£ {product.price}</strong>
                      <Link to={"/product-details/" + product._id}>
                        <button
                          className='btn-buy mb-4'
                          productId={product._id}
                        >
                          Buy Now
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
        <div className="bottom"></div>
      </>
    );
  }
}
