import React from "react";

import {
  FaFolderOpen,
  FaPlus,
  FaBoxOpen,
  FaStoreAlt,
  FaHome,

} from "react-icons/fa";


//exports all the data for the side Nav
export const adminSideNavData = [
  {
    title: "Home",
    path: "/admin/home",
    icon: <FaHome />,
    name: "nav-text",
  },

  {
    title: "Products",
    path: "/admin/all-products",
    icon: <FaStoreAlt />,
    name: "nav-text",
  },
  {
    title: "Categories",
    path: "/admin/all-categories",
    icon: <FaBoxOpen />,
    name: "nav-text",
  },
  {
    title: "Brands",
    path: "/admin/all-brands",
    icon: <FaFolderOpen />,
    name: "nav-text",
  },
  {
    title: "Add Category",
    path: "/admin/add-category",
    icon: <FaPlus />,
    name: "nav-text",
  },
  {
    title: "Add Brand",
    path: "/admin/add-brand",
    icon: <FaPlus />,
    name: "nav-text",
  },
];
