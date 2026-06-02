import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AppRouter";
import axios from "axios";

axios.defaults.baseURL = "https://stayora-backend-x75x.onrender.com/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
      />
      <AppRouter />
    </>
  );
}

export default App;
