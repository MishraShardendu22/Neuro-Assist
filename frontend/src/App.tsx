import Layout from './Layout';
import Theme from './components/Theme';
import Fast from './components/Page/Fast';
import Login from './components/Page/Login';
import Landing from './components/Page/Landing';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Page/Register';
import NotFound from './components/Page/Not-Found';
import Guidlines from './components/Page/Guidlines';
import FileStack from '../Temp/FileStack';
import HomePatient from './components/Page/Patient/Home';
import HomeHospital from './components/Page/Hospital/Home';
import EditImages from '../Temp/EditImages';
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
          path="/guidlines"
          element={
            <UnprotectedRoutes>
              <Guidlines />
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
          path="/patient/viewReports"
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
