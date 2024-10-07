import "./App.css";

import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
// import TextForm from './components/TextForm';

function App() {
  return (
    <>
      <Navbar title={"E-Doc"} home={"Home"} link={"Link"} />
      {/* <TextForm heading={'Write Your Document:'} /> */}

      <Signup></Signup>
    </>
  );
}

export default App;
