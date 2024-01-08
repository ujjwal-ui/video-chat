
import './App.css';
import MainPage from "./components/MainPage/MainPage";
import NavBar from './components/NavBar/NavBar';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
          <div className="App">
            <ToastContainer limit={1} />
            <NavBar />
            <MainPage />
          </div>
  );
}

export default App;
