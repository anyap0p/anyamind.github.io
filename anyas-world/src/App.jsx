import { HashRouter, Route, Routes} from "react-router-dom";
import React, { Component, lazy } from 'react'
import './App.css';
import Loading from './Components/Loading'
const Welcome = lazy(() => import('./Pages/Welcome'));
const About = lazy(() => import('./Pages/About'));
const Art = lazy(() => import('./Pages/Art'));
const Portrait = lazy(() => import('./Pages/Portrait'))

class App extends Component{
  render() {
    return (
      <div className="App">
        <React.Suspense fallback={<Loading />}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Welcome />} />
              <Route path="/about" element={<About />} />
              <Route path="/art" element={<Art />} />
              <Route path="/work" element={<Art />} />
              <Route path="/bio" element={<Portrait />} />
              <Route path="/welcome" element={<Welcome />} />
            </Routes>
          </HashRouter>
        </React.Suspense>
      </div>
    );
  }
}

export default App;
