import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { TodoList } from './components/TodoList';
import { PrivateRoute } from './components/PrivateRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications />
        <AuthProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/todos"
                  element={
                    <PrivateRoute>
                      <TodoList />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default App;
