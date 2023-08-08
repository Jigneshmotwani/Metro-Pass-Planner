import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ViewTripsPage from '../routes/ViewTrips';
import Planner from '../routes/Planner';
import RoutePage from '../routes/Routes';
import PassPage from '../routes/Pass';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RoutePage />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/viewtrips" element={<ViewTripsPage />} />
          <Route path="/pass" element={<PassPage />} />
          <Route path="*" element={<p>Not found!</p>} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
