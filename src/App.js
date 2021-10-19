
import './App.css';

import React, { useEffect } from "react";

import Prices from './Components/prices.js';

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

// https://prices.runescape.wiki/api/v1/osrs/latest
// https://prices.runescape.wiki/api/v1/osrs/1h


function App() {
  useEffect(() => {
    document.title = "RWT sniper"
 }, []);

  return (
    <div className="App">
      <Prices />
    </div>
  )

}

export default App;
