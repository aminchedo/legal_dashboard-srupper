import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Dev bypass via env flag
        const bypass = import.meta.env.VITE_BYPASS_AUTH === '1' || process.env.VITE_BYPASS_AUTH === '1';
        if (bypass) {
            try {
                localStorage.setItem('accessToken', localStorage.getItem('accessToken') || 'dev-bypass-token');
            } catch {}
            setIsAuthenticated(true);
            return;
        }

        const hasToken = !!(localStorage.getItem('accessToken') || localStorage.getItem('authToken'));
        if (!localStorage.getItem('accessToken') && localStorage.getItem('authToken')) {
            localStorage.setItem('accessToken', localStorage.getItem('authToken') as string);
        }
        setIsAuthenticated(hasToken);
    }, []);

    if (isAuthenticated === null) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;