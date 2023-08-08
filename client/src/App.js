import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './screens/homePage';
import MainPage from './screens/mainPage';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainPage" element={<MainPage />} />

      </Routes>

    </BrowserRouter>


  );
}

export default App;
