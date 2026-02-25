import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AppRouter";

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
