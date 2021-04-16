import { ClipLoader } from "react-spinners";
import React from "react";

// Loader function, imported from react-spinners 
const Loader = props => {
 const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  return (
    <div style={style}>
      <ClipLoader color={"#EE6C87"} loading={props.isFetching} />
    </div>
  );
};

//exports loader 
export default Loader;