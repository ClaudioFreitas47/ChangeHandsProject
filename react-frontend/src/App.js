import React, { useEffect } from "react";
import "./Assets/Styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { socket } from "./Components/appConfig"
import { BrowserRouter as Router, Route } from "react-router-dom";

//imports all user components/pages
import MainHomePage from "./Components/Pages/UserSide/Main/HomePage";
import ProductDetails from "./Components/Pages/UserSide/Main/ProductDetails";
import UserChat from "./Components/Pages/UserSide/Main/UserChat";
import UserAccountSettings from "./Components/Pages/UserSide/Main/AccountSettings";
import MyProducts from "./Components/Pages/UserSide/Main/MyProducts";
import MySavedProducts from "./Components/Pages/UserSide/Main/MySavedProducts";
import EditProduct from "./Components/Pages/UserSide/Main/EditProduct";
import ProductDashboard from "./Components/Pages/UserSide/Main/ProductDashboard";
import AddProduct from "./Components/Pages/UserSide/Main/AddProduct";
import Profile from "./Components/Pages/UserSide/Main/Profile";
import ReportForm from "./Components/Pages/UserSide/Main/ReportForm"

// imports all user authentication
import UserLogin from "./Components/Pages/Authentication/UserAuth/Login";
import UserRegister from "./Components/Pages/Authentication/UserAuth/Register";

// imports the visitor navbar
import VisitorNavbar from "./Components/Pages/Visitor/VisitorNavbar.js";
// imports the footer
import Footer from "./Components/Pages/UserSide/Nav/Footer";

//imports the admin components/pages
import AdminLogin from "./Components/Pages/Authentication/AdminAuth/Login";
import AdminHomePage from "./Components/Pages/AdminPanel/AdminHomePage";
import AdminAddCategory from "./Components/Pages/AdminPanel/AddCategory";
import AdminAddBrand from "./Components/Pages/AdminPanel/AddBrand";
import AdminEditCategory from "./Components/Pages/AdminPanel/EditCategory";
import AdminEditBrand from "./Components/Pages/AdminPanel/EditBrand";
import AdminAllCategories from "./Components/Pages/AdminPanel/AllCategories";
import AdminAllBrands from "./Components/Pages/AdminPanel/AllBrands";
import AdminEditProduct from "./Components/Pages/AdminPanel/AdminEditProduct";
import AdminAllProducts from "./Components/Pages/AdminPanel/AllProducts";
import AdminAccountSettings from "./Components/Pages/AdminPanel/AdminAccountSettings";


//sets up socket.io
const App = () => {
  useEffect(() => {
    if (localStorage.getItem("id")) {
      const name = localStorage.getItem("id");
      const profile = localStorage.getItem("email");
      socket.emit("join", { name, profile }, (error) => {
        if (error) {
          alert(error);
        }
      });
    }
  }, []);

  return (
    <div>
      <Router>
        <div>
          {/*Sets up all the routes within the application */}
          {/*All User Routes */}
          
          <Route exact path={["/", "/home"]} component={MainHomePage} />
          <Route exact path='/product-details/:productId' component={ProductDetails} />
          <Route exact path='/register' component={UserRegister} />
          <Route exact path='/VisitorNavbar' component={VisitorNavbar} />
          <Route exact path='/login' component={UserLogin} />
          <Route exact path='/my-products' component={MyProducts} />
          <Route exact path="/product-dashboard" component={ProductDashboard} />
          <Route exact path='/my-saved-products' component={MySavedProducts} />
          <Route exact path='/add-product' component={AddProduct} />
          <Route exact path='/edit-product/:id' component={EditProduct} />
          <Route exact path='/report' component={ReportForm} />
          <Route exact path={["/profile/:username", "/my-profile/:username"]} component={Profile} />
          <Route exact path='/account-setting' component={UserAccountSettings} />
          <Route path={["/inbox/:id", "/inbox"]} component={UserChat} />

          {/*All Admin Routes */}
          <Route exact path='/admin/login' component={AdminLogin} />
          <Route exact path={["/admin/home", "/admin"]} component={AdminHomePage} />
          <Route exact path='/admin/add-category' component={AdminAddCategory}/>
          <Route exact path='/admin/add-brand' component={AdminAddBrand} />
          <Route exact path='/admin/edit-brand/:id' component={AdminEditBrand}/>
          <Route exact path='/admin/edit-category/:id' component={AdminEditCategory}/>
          <Route exact path='/admin/all-categories/' component={AdminAllCategories}/>
          <Route exact path='/admin/all-brands/' component={AdminAllBrands} />
          <Route exact path='/admin/edit-product/:id' component={AdminEditProduct}/>
          <Route exact path='/admin/all-products' component={AdminAllProducts}/>
          <Route exact path='/admin/account-settings' component={AdminAccountSettings}/>
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default App;
