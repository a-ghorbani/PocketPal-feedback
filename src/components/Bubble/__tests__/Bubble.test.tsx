import React from 'react';

import {Text} from 'react-native-paper';

import {render, fireEvent} from '../../../../jest/test-utils';

import {Bubble} from '../Bubble';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const {Text: PaperText} = require('react-native-paper');
  return props => <PaperText>{props.name}</PaperText>;
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

describe('Bubble', () => {
  let mockMessage;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMessage = {
      author: {id: 'user1'},
      createdAt: 0,
      id: 'uuidv4',
      text: 'Hello, world!',
      type: 'text',
      metadata: {
        copyable: true,
        timings: {
          predicted_per_token_ms: 10,
          predicted_per_second: 100,
        },
      },
    };
  });

  const renderBubble = (message, child = 'Child content') => {
    return render(
      <Bubble
        child={<Text testID="child">{child}</Text>}
        message={message}
        nextMessageInGroup={false}
      />,
    );
  };

  it('renders correctly with all props', () => {
    const {getByText, getByTestId} = renderBubble(mockMessage);
    expect(getByTestId('child')).toBeTruthy();
    expect(getByText('10ms per token, 100.00 tokens per second')).toBeTruthy();
    expect(getByText('content-copy')).toBeTruthy();
  });

  it('does not render copy icon when message is not copyable', () => {
    const nonCopyableMessage = {
      ...mockMessage,
      metadata: {...mockMessage.metadata, copyable: false},
    };
    const {queryByText} = renderBubble(nonCopyableMessage);
    expect(queryByText('content-copy')).toBeNull();
  });

  it('calls Clipboard.setString when copy icon is pressed', () => {
    const {getByText} = renderBubble(mockMessage);
    fireEvent.press(getByText('content-copy'));
    expect(
      require('@react-native-clipboard/clipboard').setString,
    ).toHaveBeenCalledWith('Hello, world!');
  });

  it('does not crash when message.metadata is undefined', () => {
    const messageWithoutMetadata = {...mockMessage, metadata: undefined};
    const {getByText} = renderBubble(messageWithoutMetadata);
    expect(getByText('Child content')).toBeTruthy();
  });
});
