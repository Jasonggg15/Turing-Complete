import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import LevelSelect from './pages/LevelSelect';
import Play from './pages/Play';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [key, setKey] = useState(location.key);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (location.key !== key) {
      setVisible(false);
      const t = setTimeout(() => {
        setKey(location.key);
        setVisible(true);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [location.key, key]);

  return (
    <div key={key} className={visible ? 'page-enter' : ''} style={{ opacity: visible ? undefined : 0, minHeight: '100vh' }}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/play/:levelId" element={<Play />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}
