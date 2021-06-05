// import logo from './logo.svg';
import "./App.css";
import Navbar from "./Navbar/navbar.js";
import Login from "./Login/signup.js";
import Home from "./Home/Home";

function App() {
  return (
    <div className="app">
      {/* <Login /> */}
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
