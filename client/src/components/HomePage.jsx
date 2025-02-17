import { Container, Paper, Title, Text, Button, Stack, Box } from '@mantine/core';
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
    window.location.href = '/auth/github';
  };

  return (
    <Box 
      sx={(theme) => ({
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.gray[0]
      })}
    >
      <Container size="xs">
        <Paper 
          shadow="md" 
          p="xl" 
          radius="md"
          sx={{
            backgroundColor: 'white',
            textAlign: 'center'
          }}
        >
          <Stack spacing="xl">
            <Title order={1}>
              Welcome to Todo App
            </Title>
            <Text size="lg" color="dimmed">
              Sign in with GitHub to start organizing your tasks
            </Text>
            <Button
              size="lg"
              leftIcon={<IconBrandGithub size={24} />}
              onClick={handleGitHubLogin}
              fullWidth
            >
              Continue with GitHub
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
} 