import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Center, Loader } from '@mantine/core';
import PropTypes from 'prop-types';

export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
}; 