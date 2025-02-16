import { AppShell, Container, Group, Button, Text } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AppShell
      padding="md"
      header={
        user ? (
          <Container size="xl" py="sm" style={{ height: 60 }}>
            <Group position="apart" h="100%">
              <Text size="xl" weight={700}>Todo App</Text>
              <Group>
                <Text>Welcome, {user.displayName}</Text>
                <Button onClick={handleLogout} variant="light">
                  Logout
                </Button>
              </Group>
            </Group>
          </Container>
        ) : undefined
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
          minHeight: '100vh'
        },
        root: {
          backgroundColor: theme.colors.gray[0]
        }
      })}
    >
      {children}
    </AppShell>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}; 