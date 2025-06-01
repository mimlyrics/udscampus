import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./store.js";
import { Provider } from "react-redux";
import AppProvider from "./components/context/AppProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>  
        <AppProvider>
          <App />
        </AppProvider>
    </Provider>
  </React.StrictMode>
);
