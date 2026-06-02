// @ts-ignore
import { ConfigProvider } from 'antd';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage           from './pages/LoginPage';
import Navpage             from './pages/navpage';
import ProtectRoute        from './protecter/ProtectRoute';
import DoctorsPage         from './doctorspage.js/Doctors_Page';
import AlertesPage         from './alertepage/AlertesPage';
import ChangePasswordPage  from './pages/ChangePasswordPage';
import RapportPage         from './pages/Rapportpage';
import DoctorsEditPage     from './doctorspage.js/Doctors_CRUD/DoctorsEditPage';
import DoctorAddPage       from './doctorspage.js/Doctors_CRUD/DoctorAddPage';
import AlertesaddEdit      from './alertepage/AlertesEdit';
import AlertesAdd          from './alertepage/AlertesAdd';
import Dureedeconservation from './pages/Dureedeconservation';
import MigrationPage       from './pages/Migrationpage';

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
      <Router basename={process.env.PUBLIC_URL}>
<Routes>
  <Route path="/login"     element={<LoginPage />} />
  <Route path="/migration" element={<MigrationPage />} />  {/* ← MOVE HERE - public */}

  <Route
    path="/mainpage"
    element={
      <ProtectRoute>
        <Navpage />
      </ProtectRoute>
    }
  >
    <Route index                      element={<Navigate to="rapport" replace />} />
    <Route path="rapport"             element={<RapportPage />} />
    <Route path="doctors"             element={<DoctorsPage />} />
    <Route path="doctors/edit/:id"    element={<DoctorsEditPage />} />
    <Route path="doctors/new"         element={<DoctorAddPage />} />
    <Route path="alertes"             element={<AlertesPage />} />
    <Route path="alertes/edit/:id"    element={<AlertesaddEdit />} />
    <Route path="alertes/new"         element={<AlertesAdd />} />
    <Route path="changepassword"      element={<ChangePasswordPage />} />
    <Route path="Dureedeconservation" element={<Dureedeconservation />} />
    <Route path="migration"           element={<MigrationPage />} />
  </Route>

  <Route path="/"  element={<Navigate to="/login" replace />} />
  <Route path="*"  element={<Navigate to="/login" replace />} />
</Routes>
        
      </Router>
    </ConfigProvider>
  );
}

export default App;