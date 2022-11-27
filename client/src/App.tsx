
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';

import ChatSideBar from './components/ChatSideBar';

import PrivateRoutes from './components/PrivateRoutes';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

        <Route element={<PrivateRoutes />}>

          <Route path="/home" element={<Home />} />
            

        </Route>

        <Route path="/register" element={<RegisterPage/>} />


        <Route path="/" element={<LoginPage/>} />
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;
