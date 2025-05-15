import { ChatSession, Message } from '../types';

export const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    timestamp: new Date('2024-01-15T10:00:00'),
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    timestamp: new Date('2024-01-15T14:30:00'),
  },
  {
    id: '3',
    title: 'Building Scalable Applications',
    timestamp: new Date('2024-01-14T09:15:00'),
  },
  {
    id: '4',
    title: 'Frontend Architecture',
    timestamp: new Date('2024-01-14T16:45:00'),
  },
  {
    id: '5',
    title: 'State Management Patterns',
    timestamp: new Date('2024-01-13T11:20:00'),
  },
  {
    id: '6',
    title: 'Performance Optimization',
    timestamp: new Date('2024-01-13T15:10:00'),
  },
  {
    id: '7',
    title: 'Testing Strategies',
    timestamp: new Date('2024-01-12T13:25:00'),
  },
  {
    id: '8',
    title: 'CSS Architecture',
    timestamp: new Date('2024-01-12T17:40:00'),
  },
  {
    id: '9',
    title: 'API Integration',
    timestamp: new Date('2024-01-11T10:55:00'),
  },
  {
    id: '10',
    title: 'Security Best Practices',
    timestamp: new Date('2024-01-11T14:15:00'),
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    content: 'How do React hooks work?',
    role: 'user',
    timestamp: new Date('2024-01-15T10:00:00'),
  },
  {
    id: '2',
    content: 'React Hooks are functions that allow you to "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 to allow you to use state and other React features without writing a class component.',
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:00:05'),
  },
  {
    id: '3',
    content: 'Can you give me an example?',
    role: 'user',
    timestamp: new Date('2024-01-15T10:00:10'),
  },
  {
    id: '4',
    content: 'Here\'s a simple example using the useState hook:\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}\n```\n\nIn this example, useState provides a state variable (count) and a function to update it (setCount).',
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:00:15'),
  },
];
