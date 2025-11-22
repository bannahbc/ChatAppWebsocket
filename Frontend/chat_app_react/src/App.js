import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import HomePage from './Pages/Home/Home';
// import Layout from './layout';
import Logout from './Logout/Logout';
import PrivateLayout from './layout';
import NotFound from './Components/Error/Notfound';
import { Settings } from './Pages/Settings/settings';
import ProfilePage from './Pages/Profile/profile';
import { Provider } from 'react-redux';
import { store } from './Store';




function App() {
  return (
      <Provider store={store}>
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login route without navbar */}
          <Route index path='/' element={<Login />} />

          {/* All other routes wrapped with Layout (Navbar included) */}
          <Route element={<PrivateLayout/>}>

            <Route path="/home" element={<HomePage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </div>
      </Provider>
  );
}

export default App;
