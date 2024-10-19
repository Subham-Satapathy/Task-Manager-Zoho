import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Homepage from './pages/Homepage';
// import SignUp from './pages/SignUp';
// import Login from './pages/Login';
import {Dashboard} from './pages/Dashboard';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/app" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};


export default App;
