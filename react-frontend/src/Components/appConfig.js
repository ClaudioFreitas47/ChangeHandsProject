//imports the socket service
import io from "socket.io-client";

//exports the socket function
export const socket = io("http://localhost:5000");

//exports the api root
export const apiRootUrl = "http://localhost:5000/api/v1";
export const apiRootFileUrl = "http://localhost:5000/uploads";

//function for converting the date
export const convertDate = (date) => {
    let newDate = new Date(date).toDateString();
    newDate = newDate.split(" ");
    newDate = newDate[1] + " " + newDate[2] + ", " + newDate[3];
    return newDate;
  };

//log out function for user account
export const userLogout = (e) => {
  //prevents the function form working unless the button is clicked
  e.preventDefault();
  localStorage.removeItem("token")
  localStorage.removeItem("email");
  localStorage.removeItem("profile");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("id");
  window.location = "/login";
}

//logout function for admin acount
export const logoutAdmin = (e) => {
  //prevents the function from working unless the button is clicked
  e.preventDefault();
  localStorage.removeItem("token_admin");
  localStorage.removeItem("role");
  window.location = "/admin/login";
};