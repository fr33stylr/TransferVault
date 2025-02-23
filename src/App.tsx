
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import PlayerDetails from './pages/PlayerDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/player/:playerName" element={<PlayerDetails />} />
      </Routes>
    </Router>
  );
}

export default App;