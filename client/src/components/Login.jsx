import { Button, Container, Paper, Title, Text } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/todos');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/github';
  };

  return (
    <Container size="xs" mt="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} align="center" mb="md">
          Welcome to Matthew's Todo App
        </Title>
        <Text align="center" mb="xl" c="dimmed">
          Please sign in with GitHub to continue
        </Text>
        <Button
          fullWidth
          onClick={handleLogin}
          leftIcon={<IconBrandGithub size={20} />}
        >
          Sign in with GitHub
        </Button>
      </Paper>
    </Container>
  );
} 