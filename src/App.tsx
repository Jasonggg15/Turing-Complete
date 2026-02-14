import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LevelSelect from './pages/LevelSelect';
import Play from './pages/Play';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/play/:levelId" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}
