import { Component } from 'react';
import { Container, Title, Text, Button } from '@mantine/core';
import PropTypes from 'prop-types';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Title order={2}>Something went wrong</Title>
          <Text mb="md">Please try refreshing the page</Text>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}; 