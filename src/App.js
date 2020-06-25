import React from 'react';
import {BrowserRouter as Router,Route,Link} from "react-router-dom";
// import store from "./Store";  //引入redux数据管理，
// import routes from "./routes/router.js";
import Login from "./pages/Login.js"
import Home from "./pages/Home.js"


function App() {
  return (
    <div className="App">
       {/* <Login></Login> */}
       <Home></Home>
    </div>
  );
}

export default App;
