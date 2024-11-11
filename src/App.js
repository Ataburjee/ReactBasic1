import "./App.css";
import Navigator from "./components/Navigator";

// import Home from "./components/Home";
// import ModalExm from "./components/ModalExm";
// import Login from "./components/Login";

import Navbar from "./components/Navbar";
// import Signup from "./components/Signup";
// import TextForm from './components/TextForm';

function App() {
  return (
    <>
      {/* <TextForm heading={'Write Your Document:'} /> */}

      {/* <Router>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router> */}

      {/* <Signup/> */}
      {/* <Login/> */}
      {/* <Home/> */}
      {/* <ModalExm></ModalExm> */}
      <Navbar/>
      <Navigator/>
    </>
  );
}

export default App;
