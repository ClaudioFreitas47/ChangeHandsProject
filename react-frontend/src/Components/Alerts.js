import Swal from "sweetalert2";

//uses sweetalert2 to provide custom alerts
const Alert = Swal.mixin({
  toast: false,
  position: "center",
  showConfirmButton: true,
  timer: 3000,
  timerProgressBar: true,
});

//sets the variable name to be used globally
//sets the type and title e.g for errors or success messages
const notification = (type, title, message) => {
  Alert.fire({
    icon: type,
    title: title,
    text: message,
  });
};

export default notification;