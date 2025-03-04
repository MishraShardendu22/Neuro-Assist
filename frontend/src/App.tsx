import Layout from './Layout';
import Theme from './components/Theme';
import Fast from './components/Page/Fast';
import FileStack from '../Temp/FileStack';
import EditImages from '../Temp/EditImages';
import Login from './components/Page/Login';
import Landing from './components/Page/Landing';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Page/Register';
import NotFound from './components/Page/Not-Found';
import Guidlines from './components/Page/Guidlines';
import NewCase from './components/Page/Hospital/NewCase';
import HomePatient from './components/Page/Patient/Home';
import HomeHospital from './components/Page/Hospital/Home';
import Emergency from './components/Page/Hospital/Emergency';
import ReportsPatient from './components/Page/Patient/Reports';
import ProfilePatient from './components/Page/Patient/Profile';
import ProtectedPatient from './components/Routes/protected/patient.route';
import UnprotectedRoutes from './components/Routes/un-protected/unprotected';
import ProtectedHospital from './components/Routes/protected/hospital.route';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={
            <UnprotectedRoutes>
              <Login />
            </UnprotectedRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <UnprotectedRoutes>
              <Register />
            </UnprotectedRoutes>
          }
        />

        <Route
          path="/patient/home"
          element={
            <ProtectedPatient>
              <HomePatient />
            </ProtectedPatient>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedPatient>
              <ProfilePatient />
            </ProtectedPatient>
          }
        />
        <Route
          path="/patient/history"
          element={
            <ProtectedPatient>
              <ReportsPatient />
            </ProtectedPatient>
          }
        />

        <Route
          path="/hospital/home"
          element={
            <ProtectedHospital>
              <HomeHospital />
            </ProtectedHospital>
          }
        />
        <Route
          path="/hospital/history"
          element={
            <ProtectedHospital>
              <HomeHospital />
            </ProtectedHospital>
          }
        />
        <Route
          path="/hospital/cases"
          element={
            <ProtectedHospital>
              <NewCase />
            </ProtectedHospital>
          }
        />
        <Route
          path="/hospital/emergency"
          element={
            <ProtectedHospital>
              <Emergency />
            </ProtectedHospital>
          }
        />
        <Route
          path="/hospital/guidlines"
          element={
            <ProtectedHospital>
              <Guidlines />
            </ProtectedHospital>
          }
        />

        <Route
          path="/too-fast"
          element={
            <UnprotectedRoutes>
              <Fast />
            </UnprotectedRoutes>
          }
        />

        <Route
          path="/file-temp"
          element={
            <UnprotectedRoutes>
              <FileStack />
            </UnprotectedRoutes>
          }
        />
        <Route
          path="/image-temp"
          element={
            <UnprotectedRoutes>
              <EditImages />
            </UnprotectedRoutes>
          }
        />
        <Route
          path="*"
          element={
            <UnprotectedRoutes>
              <NotFound />
            </UnprotectedRoutes>
          }
        />
      </Routes>
      <Theme />
    </Layout>
  );
};

export default App;
