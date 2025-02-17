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
          shadow="xl" 
          p={30} 
          radius="md"
          sx={(theme) => ({
            backgroundColor: 'white',
            textAlign: 'center',
            border: `1px solid ${theme.colors.gray[2]}`,
            transition: 'transform 150ms ease, box-shadow 150ms ease',
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: theme.shadows.lg
            }
          })}
        >
          <Stack spacing="lg">
            <Title 
              order={1} 
              sx={(theme) => ({
                color: theme.colors.dark[8],
                fontSize: '2rem',
                fontWeight: 600
              })}
            >
              Welcome to Matthew&apos;s Todo App
            </Title>
            <Text 
              size="lg" 
              color="dimmed"
              sx={{ lineHeight: 1.6 }}
            >
              Sign in with GitHub to start organizing your tasks
            </Text>
            <Button
              size="lg"
              leftIcon={<IconBrandGithub size={24} />}
              onClick={handleGitHubLogin}
              fullWidth
              variant="filled"
              sx={(theme) => ({
                marginTop: theme.spacing.md,
                transition: 'transform 150ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              })}
            >
              Continue with GitHub
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
} 