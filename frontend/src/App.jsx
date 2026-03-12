import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AppRouter";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000"
axios.defaults.withCredentials = true

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
