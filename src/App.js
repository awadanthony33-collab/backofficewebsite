// @ts-ignore
import { ConfigProvider } from 'antd';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage        from './pages/LoginPage';
import Navpage          from './pages/navpage';
import ProtectRoute     from './protecter/ProtectRoute';

// ── Page imports ──────────────────────────────────────────────────────────────

import DoctorsPage      from './doctorspage.js/Doctors_Page';
import AlertesPage      from './alertepage/AlertesPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RapportPage from './pages/Rapportpage';
import DoctorsEditPage from './doctorspage.js/Doctors_CRUD/DoctorsEditPage';
import DoctorAddPage from './doctorspage.js/Doctors_CRUD/DoctorAddPage';
import Duree_de_conservation from './pages/Duree_de_conservation';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#a4091b',
          borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/mainpage"
            element={
              <ProtectRoute>
                <Navpage />
              </ProtectRoute>
            }
          >

            <Route index element={<Navigate to="rapport" replace />} />
            <Route path="rapport"         element={<RapportPage />} />
            <Route path="doctors"         element={<DoctorsPage />} />
            <Route path="/mainpage/doctors/edit/:id" element={<DoctorsEditPage />} /> 
            <Route path="/mainpage/doctors/new"        element={<DoctorAddPage />} />
            <Route path="alertes"         element={<AlertesPage />} />
            <Route path="changepassword" element={<ChangePasswordPage />} />
            <Route path="Duree_de_conservation" element={<Duree_de_conservation/>} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;