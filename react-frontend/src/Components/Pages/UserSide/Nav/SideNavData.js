import React from "react";

//imports Font Awesome icons
import {
  FaEnvelopeOpenText,
  FaPlus,
  FaCommentDots,
  FaStoreAlt,
  FaCog,
  FaHome,
  FaExclamation,

} from "react-icons/fa";

//exports the data for the side navigation bar
export const sideNavData = [
  {
    title: "Home",
    path: "/",
    icon: <FaHome />,
    name: "nav-text",
  },
  {
    title:"All Products",
    path: "/product-dashboard",
    icon: <FaStoreAlt />,
    name: "nav-text",

  },
  {
    title: "Inbox",
    path: "/inbox",
    icon: <FaCommentDots />,
    name: "nav-text",
  },
  
  {
    title: "My Products",
    path: "/my-products",
    icon: <FaEnvelopeOpenText />,
    name: "nav-text",
  },
  {
    title: "Add New Product",
    path: "/add-product",
    icon: <FaPlus />,
    name: "nav-text",
  },
  {
    title: "My Saved Products",
    path: "/my-saved-products",
    icon: <FaEnvelopeOpenText />,
    name: "nav-text",
  },
  {
    title: "My Profile",
    path: `/my-profile/${localStorage.getItem("username")}`,
    icon: <FaEnvelopeOpenText />,
    name: "nav-text",
  },
  {
    title: "Account Settings",
    path: "/account-setting",
    icon: <FaCog />,
    name: "nav-text",
  },
  {
    title: "Report An Issue",
    path: "/report",
    icon: <FaExclamation />,
    name: "nav-text",
  },
];

