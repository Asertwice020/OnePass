// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { disableReactDevTools } from "@fvilers/disable-react-devtools";

// if (import.meta.env.MODE === "development") disableReactDevTools();
// console.log({ applicatoionRunningIn: import.meta.env.MODE });

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)