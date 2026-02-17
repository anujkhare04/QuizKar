import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from "react-redux";
import store from "./src/store/store";
import { BrowserRouter } from "react-router-dom";

if (import.meta.env.PROD) {
  console.log = () => { };
  console.debug = () => { };
  console.info = () => { };
  console.warn = () => { };
  // Keeping console.error to help debugging in production if needed
}

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </BrowserRouter>

)
