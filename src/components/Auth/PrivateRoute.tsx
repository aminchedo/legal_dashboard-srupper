import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    // Normalize: prefer accessToken across app
    const isAuthenticated = !!(localStorage.getItem('accessToken') || localStorage.getItem('authToken'));
    if (!localStorage.getItem('accessToken') && localStorage.getItem('authToken')) {
        localStorage.setItem('accessToken', localStorage.getItem('authToken') as string);
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

