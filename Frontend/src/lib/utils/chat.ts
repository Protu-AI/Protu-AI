import { startOfDay } from 'date-fns';
import { groupBy } from 'lodash';
import { ChatSession } from '@/features/chat/types';

export function groupChatSessionsByDate(sessions: ChatSession[]) {
  return groupBy(sessions, (session) =>
    startOfDay(session.timestamp).getTime()
  );
}
