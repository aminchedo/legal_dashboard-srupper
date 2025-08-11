import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Check if we have an access token or legacy auth token
        const hasToken = !!(localStorage.getItem('accessToken') || localStorage.getItem('authToken'));

        // Migrate legacy token if needed
        if (!localStorage.getItem('accessToken') && localStorage.getItem('authToken')) {
            localStorage.setItem('accessToken', localStorage.getItem('authToken') as string);
        }

        // Update authentication state
        setIsAuthenticated(hasToken);
    }, []);

    // Show nothing while we're checking authentication status
    if (isAuthenticated === null) {
        return null;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Redirect to login but remember where the user was trying to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Allow access to protected routes if authenticated
    return <Outlet />;
};

export default PrivateRoute;