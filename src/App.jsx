import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventPublic from './pages/EventPublic';
import Album from './pages/Album';
import LiveWall from './pages/LiveWall';
import Moderation from './pages/Moderation';
import GuestInteraction from './pages/GuestInteraction';
import PrintKiosk from './pages/PrintKiosk';
import EventMobile from './pages/EventMobile';
import Configuration from './pages/Configuration';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacidad" element={<Privacy />} />
      <Route path="/terminos" element={<Terms />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/event/:eventId" element={<EventPublic />} />
      <Route path="/qr/:eventId" element={<EventMobile />} />
      <Route path="/album/:eventId" element={<Album />} />
      <Route path="/live/:eventId" element={<LiveWall />} />
      <Route path="/moderation/:eventId" element={<Moderation />} />
      <Route path="/interaction/:eventId" element={<GuestInteraction />} />
      <Route path="/kiosk/:eventId" element={<PrintKiosk />} />
      <Route path="/configuration/:eventId" element={<Configuration />} />
    </Routes>
  );
}

export default App;
