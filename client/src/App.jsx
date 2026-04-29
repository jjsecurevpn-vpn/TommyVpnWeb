import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Status from './pages/Status';
import Admin from './pages/Admin';
import Buy from './pages/Buy';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-gray-100 selection:bg-accent/30">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/status" element={<Status />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/admin123" element={<Admin />} />
          </Routes>
        </main>
        
        {/* Decorative background glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 blur-[120px] -z-10 pointer-events-none"></div>
      </div>
    </Router>
  );
}

export default App;
