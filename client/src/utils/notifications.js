import { notifications } from '@mantine/notifications';

export const showNotification = (type, message) => {
  notifications.show({
    title: type === 'success' ? 'Success' : 'Error',
    message,
    color: type === 'success' ? 'green' : 'red'
  });
}; 