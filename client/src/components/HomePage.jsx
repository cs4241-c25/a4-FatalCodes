import { Container, Paper, Title, Text, Button, Stack } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/todos');
    }
  }, [user, navigate]);

  const handleGitHubLogin = () => {
    window.location.href = '/auth/github';  // Use relative URL
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="lg" p="xl" radius="md">
        <Stack align="center" spacing="xl">
          <Title order={1} align="center">
            Welcome to Matthew&apos;s Todo App
          </Title>
          <Text size="lg" align="center" color="dimmed" maw={600}>
            Sign in with GitHub to start organizing your tasks
          </Text>
          <Button
            size="lg"
            leftIcon={<IconBrandGithub size={24} />}
            onClick={handleGitHubLogin}
          >
            Continue with GitHub
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
} 