import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import Reservation from './Reservation';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/reserve" element={<Reservation />} />
        </Routes>
    );
}

export default App;