import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import HomePage from './Pages/Home/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
    <Route index element = {<Login/>} />
    <Route path='/home' element = {<HomePage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
