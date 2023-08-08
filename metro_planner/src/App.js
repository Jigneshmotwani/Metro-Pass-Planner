import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './screens/login';
import Welcome from './screens/welcome';
import RouteRecommender from './screens/routeRecommender';
import PassRecommender from './screens/passRecommender';
import ViewTrips from './screens/viewTrips';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/routeRecommender" element={<RouteRecommender />} />
        <Route path="/passRecommender" element={<PassRecommender />} />
        <Route path="/viewTrips" element={<ViewTrips />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
