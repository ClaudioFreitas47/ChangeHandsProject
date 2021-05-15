import React, { Component } from "react";
import UserNavbar from "./../Nav/UserNavbar";
import { Container, Col, Row, Table, Image } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { apiRootUrl, apiRootFileUrl,} from "./../../../appConfig";
import notification from "./../../../Alerts"
import "./../../../../Assets/Styles/Main.css";

export default class MySavedProducts extends Component {

    //sets products array to empty
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
//API request to get all the users saved products and uses auth token
  getSavedProducts() {
    axios.get(apiRootUrl + "/products/mySavedProducts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
//returns the data and sets the state with the product data
      .then((res) => {
        this.setState({
          products: res.data.data,
        });
      })
      //returns error alert if issues encountered
      .catch((err) => {
        notification("error", "Error", err.response.data.error)
      });
  }
  //mounts component, executed after first render
  componentDidMount() {
    this.getSavedProducts();
  }

  render() {
    //Bootstrap used to create container, row, col and table
    return (
      <>
        <UserNavbar />
        <div className="table-top">
          <h2>My Saved Products</h2>
        </div>
        <Container>
          <Row>
            <Col lg={1} md={1} xs={0}></Col>
            <Col lg={10} md={10} xs={10}>
              <Table responsive='sm' striped hover>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Product Description</th>
                    <th>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {/*Maps out all the users saved products*/}
                  {this.state.products.length > 0 ? (

                    
                    this.state.products.map((product) => {
                      return (
                        <tr key={product._id}>
                          <td>
                          <Link to={"/product-details/" + product.product._id}>
                            <Image
                              src={`${apiRootFileUrl}/${product.product.image}`}
                              className='image-product'
                              rounded
                            />
                            </Link>
                          </td>
                          <td>{product.product.name}</td>
                          <td>{product.product.price}</td>
                          <td>{product.product.description}</td>
                        {/*Displays an empty table if no products are found */}
                          <td>
                            <Link to={"/product-details/" + product.product._id}>
                              <button className='btn-view'>
                                View Item
                              </button>
                            </Link>
                          </td>
                        </tr>
                        
                      );
                    })
                    
                  ) : (
                    
                    <tr>
                      <td colSpan='7'>No Saved Products Are Available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
