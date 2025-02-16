import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  TextInput, 
  Select, 
  Button, 
  Group,
  Table,
  Checkbox,
  ActionIcon,
  Badge
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { todoService } from '../services/api';
import { showNotification } from '../utils/notifications';
import { PRIORITIES, CATEGORIES, DEFAULT_FORM_DATA } from '../constants';

dayjs.extend(utc);
dayjs.extend(timezone);

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState('');

  const fetchTodos = async () => {
    try {
      const { data } = await todoService.fetchTodos();
      setTodos(data);
    } catch {
      showNotification('error', 'Failed to fetch todos');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await todoService.createTodo(formData);
      setFormData(DEFAULT_FORM_DATA);
      fetchTodos();
      showNotification('success', 'Todo added successfully');
    } catch {
      showNotification('error', 'Failed to add todo');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await todoService.updateTodo(id, { completed: !completed });
      fetchTodos();
    } catch {
      showNotification('error', 'Failed to update todo');
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditTask(todo.task);
  };

  const handleSaveEdit = async (id) => {
    try {
      await todoService.updateTodo(id, { task: editTask });
      setEditingId(null);
      fetchTodos();
      showNotification('success', 'Todo updated successfully');
    } catch {
      showNotification('error', 'Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoService.deleteTodo(id);
      fetchTodos();
      showNotification('success', 'Todo deleted successfully');
    } catch {
      showNotification('error', 'Failed to delete todo');
    }
  };

  const formatDate = (date) => 
    dayjs(date).tz('America/New_York').format('MM/DD/YYYY hh:mm A');

  const getPriorityColor = (priority) => 
    PRIORITIES.find(p => p.value === priority)?.color || 'gray';

  const getCategoryColor = (category) => 
    CATEGORIES.find(c => c.value === category)?.color || 'gray';

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="md" mb="xl">
        <Title order={2} mb="md">Add New Task</Title>
        <form onSubmit={handleSubmit}>
          <Group grow mb="md">
            <TextInput
              required
              label="Task"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            />
            <Select
              required
              label="Category"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              data={CATEGORIES}
            />
          </Group>
          <Group grow mb="md">
            <Select
              required
              label="Priority"
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
              data={PRIORITIES}
            />
            <DateTimePicker
              label="Deadline"
              value={formData.customDeadline}
              onChange={(value) => setFormData({ ...formData, customDeadline: value })}
              valueFormat="MM/DD/YYYY hh:mm A"
              timezone="America/New_York"
              amPmFormat="12"
            />
          </Group>
          <Group position="right">
            <Button type="submit">Add Task</Button>
          </Group>
        </form>
      </Paper>

      <Paper shadow="sm" p="md">
        <Title order={2} mb="md">Your Tasks</Title>
        <Table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Task</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id}>
                <td>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo._id, todo.completed)}
                  />
                </td>
                <td style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {editingId === todo._id ? (
                    <TextInput
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(todo._id)}
                    />
                  ) : (
                    todo.task
                  )}
                </td>
                <td>
                  <Badge color={getCategoryColor(todo.category)}>
                    {CATEGORIES.find(c => c.value === todo.category)?.label || todo.category}
                  </Badge>
                </td>
                <td>
                  <Badge color={getPriorityColor(todo.priority)}>
                    {PRIORITIES.find(p => p.value === todo.priority)?.label || todo.priority}
                  </Badge>
                </td>
                <td>{formatDate(todo.creationDate)}</td>
                <td>{formatDate(todo.deadline)}</td>
                <td>
                  <Group spacing="xs">
                    <ActionIcon
                      color={editingId === todo._id ? 'green' : 'blue'}
                      onClick={() => editingId === todo._id 
                        ? handleSaveEdit(todo._id) 
                        : handleEdit(todo)
                      }
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDelete(todo._id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
} 