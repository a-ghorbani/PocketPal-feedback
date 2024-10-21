import * as React from 'react';
import {Linking, Text, View} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import {
  LinkPreview,
  PreviewData,
  REGEX_LINK,
} from '@flyerhq/react-native-link-preview';

import {useTheme} from '../../hooks';

import {styles} from './styles';
import {MarkdownView} from '../MarkdownView';

import {MessageType} from '../../utils/types';
import {
  excludeDerivedMessageProps,
  getUserName,
  UserContext,
} from '../../utils';

export interface TextMessageTopLevelProps {
  /** @see {@link LinkPreviewProps.onPreviewDataFetched} */
  onPreviewDataFetched?: ({
    message,
    previewData,
  }: {
    message: MessageType.Text;
    previewData: PreviewData;
  }) => void;
  /** Enables link (URL) preview */
  usePreviewData?: boolean;
}

export interface TextMessageProps extends TextMessageTopLevelProps {
  enableAnimation?: boolean;
  message: MessageType.DerivedText;
  messageWidth: number;
  showName: boolean;
}

export const TextMessage = ({
  enableAnimation,
  message,
  messageWidth,
  onPreviewDataFetched,
  showName,
  usePreviewData,
}: TextMessageProps) => {
  const theme = useTheme();
  const user = React.useContext(UserContext);
  const [previewData, setPreviewData] = React.useState(message.previewData);
  const {descriptionText, headerText, titleText, text, textContainer} = styles({
    message,
    theme,
    user,
  });

  const handleEmailPress = (email: string) => {
    try {
      Linking.openURL(`mailto:${email}`);
    } catch {}
  };

  const handlePreviewDataFetched = (data: PreviewData) => {
    setPreviewData(data);
    onPreviewDataFetched?.({
      // It's okay to cast here since we know it is a text message
      // type-coverage:ignore-next-line
      message: excludeDerivedMessageProps(message) as MessageType.Text,
      previewData: data,
    });
  };

  const handleUrlPress = (url: string) => {
    const uri = url.toLowerCase().startsWith('http') ? url : `https://${url}`;

    Linking.openURL(uri);
  };

  const renderPreviewDescription = (description: string) => {
    return (
      <Text numberOfLines={3} style={descriptionText}>
        {description}
      </Text>
    );
  };

  const renderPreviewHeader = (header: string) => {
    return (
      <Text numberOfLines={1} style={headerText}>
        {header}
      </Text>
    );
  };

  const renderPreviewText = (previewText: string) => {
    return (
      <ParsedText
        accessibilityRole="link"
        parse={[
          {
            onPress: handleEmailPress,
            style: [text, {textDecorationLine: 'underline'}],
            type: 'email',
          },
          {
            onPress: handleUrlPress,
            pattern: REGEX_LINK,
            style: [text, {textDecorationLine: 'underline'}],
          },
        ]}
        style={text}>
        {previewText}
      </ParsedText>
    );
  };

  const renderPreviewTitle = (title: string) => {
    return (
      <Text numberOfLines={2} style={titleText}>
        {title}
      </Text>
    );
  };

  return usePreviewData &&
    !!onPreviewDataFetched &&
    REGEX_LINK.test(message.text.toLowerCase()) ? (
    <LinkPreview
      containerStyle={{width: previewData?.image ? messageWidth : undefined}}
      enableAnimation={enableAnimation}
      header={showName ? getUserName(message.author) : undefined}
      onPreviewDataFetched={handlePreviewDataFetched}
      previewData={previewData}
      renderDescription={renderPreviewDescription}
      renderHeader={renderPreviewHeader}
      renderText={renderPreviewText}
      renderTitle={renderPreviewTitle}
      text={message.text}
      textContainerStyle={textContainer}
      touchableWithoutFeedbackProps={{
        accessibilityRole: undefined,
        accessible: false,
        disabled: true,
      }}
    />
  ) : (
    <View style={textContainer}>
      {
        // Tested inside the link preview
        /* istanbul ignore next */ showName
          ? renderPreviewHeader(getUserName(message.author))
          : null
      }
      <MarkdownView
        markdownText={message.text.trim()}
        maxMessageWidth={messageWidth}
      />

      {/*Platform.OS === 'ios' ? (
        <TextInput
          multiline
          editable={false}
          style={[
            text,
            {
              lineHeight: undefined,
            },
          ]}>
          {message.text.trim()}
        </TextInput>
      ) : (
        <Text selectable={true} style={text}>
          {message.text}
        </Text>
      )*/}
    </View>
  );
};
