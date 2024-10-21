import React from 'react';

import {render, fireEvent} from '@testing-library/react-native';

import {MarkdownView} from '../MarkdownView';

describe('MarkdownView Component', () => {
  it('renders markdown content correctly', () => {
    const markdownText = 'Hello **World**';
    const {getByText} = render(
      <MarkdownView markdownText={markdownText} maxMessageWidth={300} />,
    );

    expect(getByText('Hello World')).toBeTruthy();
  });

  it('handles different content widths properly', () => {
    const markdownText = '# Test Markdown';
    const {getByTestId, rerender} = render(
      <MarkdownView markdownText={markdownText} maxMessageWidth={300} />,
    );

    // Simulate a layout change
    fireEvent(getByTestId('chatMarkdownScrollView'), 'layout', {
      nativeEvent: {
        layout: {width: 200, height: 100},
      },
    });

    rerender(
      <MarkdownView markdownText={markdownText} maxMessageWidth={200} />,
    );

    expect(getByTestId('chatMarkdownScrollView').props.style.maxWidth).toBe(
      200,
    );
  });
});
