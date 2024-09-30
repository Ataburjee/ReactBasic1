import './App.css';

import Navbar from './components/Navbar'
import TextForm from './components/TextForm';

function App() {
  return (
    <>
      <Navbar title={'E-Doc'} home={'Home'} link={'Link'} />
      <TextForm heading={'Write Your Document:'} />
    </>
  );
}

export default App;
