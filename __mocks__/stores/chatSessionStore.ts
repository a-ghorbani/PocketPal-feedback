import {sessionFixtures} from '../../jest/fixtures/chatSessions';

export const mockChatSessionStore = {
  sessions: sessionFixtures,
  //currentSessionMessages: [],
  activeSessionId: 'session-1',
  loadSessionList: jest.fn().mockResolvedValue(undefined),
  deleteSession: jest.fn().mockResolvedValue(undefined),
  setActiveSession: jest.fn(),
  addMessageToCurrentSession: jest.fn(),
  resetActiveSession: jest.fn(),
  updateSessionTitle: jest.fn(),
  saveSessionsMetadata: jest.fn(),
  groupedSessions: {
    Today: [sessionFixtures[0]],
    Yesterday: [sessionFixtures[1]],
  },
  createNewSession: jest.fn(),
  updateMessage: jest.fn(),
  updateMessageToken: jest.fn(),
};

Object.defineProperty(mockChatSessionStore, 'currentSessionMessages', {
  get: jest.fn(() => []),
  configurable: true,
});
