import * as React from 'react';
import {TextInput, TextInputProps, View} from 'react-native';

import {useTheme} from '../../hooks';

import {styles} from './styles';

import {MessageType} from '../../utils/types';
import {L10nContext, unwrap, UserContext} from '../../utils';

import {
  AttachmentButton,
  AttachmentButtonAdditionalProps,
  CircularActivityIndicator,
  CircularActivityIndicatorProps,
  SendButton,
  StopButton,
} from '..';

export interface InputTopLevelProps {
  /** Whether attachment is uploading. Will replace attachment button with a
   * {@link CircularActivityIndicator}. Since we don't have libraries for
   * managing media in dependencies we have no way of knowing if
   * something is uploading so you need to set this manually. */
  isAttachmentUploading?: boolean;
  /** @see {@link AttachmentButtonProps.onPress} */
  onAttachmentPress?: () => void;
  /** Will be called on {@link SendButton} tap. Has {@link MessageType.PartialText} which can
   * be transformed to {@link MessageType.Text} and added to the messages list. */
  onSendPress: (message: MessageType.PartialText) => void;
  onStopPress?: () => void;
  isStopVisible?: boolean;
  /** Controls the visibility behavior of the {@link SendButton} based on the
   * `TextInput` state. Defaults to `editing`. */
  sendButtonVisibilityMode?: 'always' | 'editing';
  textInputProps?: TextInputProps;
}

export interface InputAdditionalProps {
  attachmentButtonProps?: AttachmentButtonAdditionalProps;
  attachmentCircularActivityIndicatorProps?: CircularActivityIndicatorProps;
}

export type InputProps = InputTopLevelProps & InputAdditionalProps;

/** Bottom bar input component with a text input, attachment and
 * send buttons inside. By default hides send button when text input is empty. */
export const Input = ({
  attachmentButtonProps,
  attachmentCircularActivityIndicatorProps,
  isAttachmentUploading,
  onAttachmentPress,
  onSendPress,
  onStopPress,
  isStopVisible,
  sendButtonVisibilityMode,
  textInputProps,
}: InputProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = useTheme();
  const user = React.useContext(UserContext);
  const {container, input, marginRight} = styles({theme});

  // Use `defaultValue` if provided
  const [text, setText] = React.useState(textInputProps?.defaultValue ?? '');

  const value = textInputProps?.value ?? text;

  const handleChangeText = (newText: string) => {
    // Track local state in case `onChangeText` is provided and `value` is not
    setText(newText);
    textInputProps?.onChangeText?.(newText);
  };

  const handleSend = () => {
    const trimmedValue = value.trim();

    // Impossible to test since button is not visible when value is empty.
    // Additional check for the keyboard input.
    /* istanbul ignore next */
    if (trimmedValue) {
      onSendPress({text: trimmedValue, type: 'text'});
      setText('');
    }
  };

  return (
    <View style={container}>
      {user &&
        (isAttachmentUploading ? (
          <CircularActivityIndicator
            {...{
              ...attachmentCircularActivityIndicatorProps,
              color: theme.colors.onSurface,
              style: marginRight,
            }}
          />
        ) : (
          !!onAttachmentPress && (
            <AttachmentButton
              {...unwrap(attachmentButtonProps)}
              onPress={onAttachmentPress}
            />
          )
        ))}
      <TextInput
        multiline
        placeholder={l10n.inputPlaceholder}
        placeholderTextColor={theme.colors.outline}
        underlineColorAndroid="transparent"
        {...textInputProps}
        // Keep our implementation but allow user to use these `TextInputProps`
        style={[input, textInputProps?.style]}
        onChangeText={handleChangeText}
        value={value}
      />
      {sendButtonVisibilityMode === 'always' ||
      (sendButtonVisibilityMode === 'editing' && user && value.trim()) ? (
        <SendButton onPress={handleSend} />
      ) : null}
      {isStopVisible && <StopButton onPress={onStopPress} />}
    </View>
  );
};
