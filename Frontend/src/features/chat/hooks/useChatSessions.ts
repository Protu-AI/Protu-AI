import { useState, useCallback } from 'react';
import { ChatSession } from '../types';
import { groupBy } from 'lodash';
import { startOfDay } from 'date-fns';

export function useChatSessions(initialSessions: ChatSession[]) {
  const [sessions, setSessions] = useState(initialSessions);
  const [search, setSearch] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string>();

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupedSessions = groupBy(filteredSessions, (session) =>
    startOfDay(session.timestamp).getTime()
  );

  const handleNewChat = useCallback(() => {
    // Implementation for new chat
    console.log('Creating new chat');
  }, []);

  return {
    sessions: groupedSessions,
    search,
    setSearch,
    currentSessionId,
    setCurrentSessionId,
    handleNewChat,
  };
}
