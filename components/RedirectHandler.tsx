import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRedirectTarget } from '../utils/redirectMap';

const RedirectHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const target = getRedirectTarget(location.pathname);
    if (target && target !== location.pathname) {
      // Retain search query parameters or hash if present
      const fullTarget = `${target}${location.search}${location.hash}`;
      navigate(fullTarget, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
};

export default RedirectHandler;
