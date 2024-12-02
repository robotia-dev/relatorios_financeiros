// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import RelatoriosPage from './components/pages/Relatorios';
// import About from './components/pages/About';
// import Dashboard from './components/pages/Dashboard';

const AppRouter = () => {
  return (
    <Router>
   
        <Routes>
          <Route path="/" element={<Home />} />
         <Route path="/relatorios" element={<RelatoriosPage />} />
            {/*<Route path="/dashboard" element={<Dashboard />} /> */}
          {/* Adicione mais rotas conforme necessário */}
        </Routes>
   
    </Router>
  );
};

export default AppRouter;