
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import BuilderPage from './components/BuilderPage';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* 项目路由：支持 :projectId 参数，方便分享和定位 */}
          <Route path="/project/:projectId/:tab" element={<BuilderPage />} />
          <Route path="/project/:projectId" element={<BuilderPage />} />
          
          {/* 默认构建页（无项目ID时，通常是新建或加载上次的项目） */}
          <Route path="/" element={<BuilderPage />} />
          
          <Route path="/intro" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
