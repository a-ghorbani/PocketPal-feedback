import {act, render} from '@testing-library/react-native';
import * as React from 'react';
import {Image} from 'react-native';

import {derivedImageMessage, size} from '../../../../jest/fixtures';
import {ImageMessage} from '../ImageMessage';

describe('image message', () => {
  it('gets image size and renders', () => {
    expect.assertions(5);
    const getSizeMock = jest.spyOn(Image, 'getSize');
    getSizeMock.mockImplementation(() => {});
    const message = {
      ...derivedImageMessage,
      height: undefined,
      width: undefined,
    };
    const {getByTestId} = render(
      <ImageMessage message={message} messageWidth={440} />,
    );
    expect(getSizeMock).toHaveBeenCalledTimes(1);
    const getSizeArgs = getSizeMock.mock.calls[0];
    expect(getSizeArgs[0]).toBe(derivedImageMessage.uri);
    const success = getSizeArgs[1];
    const error = getSizeArgs[2];
    act(() => {
      success(size.width, size.height);
    });
    const successImageComponent = getByTestId('message-image');
    expect(successImageComponent.props).toHaveProperty('style.height', 440);
    act(() => {
      success(size.width, size.width * 10 + 1);
    });
    const successMinimizedImageComponent = getByTestId('message-image');
    expect(successMinimizedImageComponent.props).toHaveProperty(
      'style.width',
      64,
    );
    act(() => {
      if (error) {
        error(new Error());
      }
    });
    const errorImageComponent = getByTestId('message-image');
    expect(errorImageComponent.props).toHaveProperty('style.width', 64);
    getSizeMock.mockRestore();
  });
});
