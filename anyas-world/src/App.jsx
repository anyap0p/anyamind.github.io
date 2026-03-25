import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { Component, lazy } from 'react'
import './App.css';
import Loading from './Components/Loading'
const Welcome = lazy(() => import('./Pages/Welcome'));
const About = lazy(() => import('./Pages/About'));
const Art = lazy(() => import('./Pages/Art'));
const ArtWorkPiece = lazy(() => import('./Pages/ArtWorkPiece'));
const MermaidMotel = lazy(() => import('./Pages/MermaidMotel'));
const Portrait = lazy(() => import('./Pages/Portrait'));
const Tunnel = lazy(() => import('./Pages/Tunnel'));

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
              <Route path="/art/piece/:slug" element={<ArtWorkPiece />} />
              <Route path="/art/labyrinth" element={<Navigate to="/art/piece/labyrinth" replace />} />
              <Route path="/art/self-portrait" element={<Navigate to="/art/piece/self-portrait" replace />} />
              <Route path="/art/mermaid-motel" element={<MermaidMotel />} />
              <Route path="/wip" element={<Art />} />
              <Route path="/work" element={<Art />} />
              <Route path="/bio" element={<Portrait />} />
              <Route path="/tunnel" element={<Tunnel />} />
              <Route path="/welcome" element={<Welcome />} />
            </Routes>
          </HashRouter>
        </React.Suspense>
      </div>
    );
  }
}

export default App;
