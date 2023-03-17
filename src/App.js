
import './App.css'

// import Overview from './pages/Overview'
import DataScreen from './pages/DataScreen'
import Login from './pages/Login'
import { HashRouter } from "react-router-dom"
import Router from './routers'

function App() {
  return (
    <div className="App">
      {/* <Overview /> */}
      {/* <DataScreen /> */}
      <HashRouter>
        <Router />
      </HashRouter>
      {/* <Login /> */}
    </div>
  );
}

export default App;
