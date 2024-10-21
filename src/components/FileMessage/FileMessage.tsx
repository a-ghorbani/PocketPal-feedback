import * as React from 'react';
import {Image, Text, View} from 'react-native';

import {useTheme} from '../../hooks';

import {styles} from './styles';

import {MessageType} from '../../utils/types';
import {formatBytes, L10nContext, UserContext} from '../../utils';

export interface FileMessageProps {
  message: MessageType.DerivedFile;
}

export const FileMessage = ({message}: FileMessageProps) => {
  const l10n = React.useContext(L10nContext);
  const user = React.useContext(UserContext);
  const theme = useTheme();
  const {container, icon, iconContainer, name, size, textContainer} = styles({
    message,
    theme,
    user,
  });

  return (
    <View
      accessibilityLabel={l10n.fileButtonAccessibilityLabel}
      style={container}>
      <View style={iconContainer}>
        {theme.icons?.documentIcon?.() ?? (
          <Image
            source={require('../../assets/icon-document.png')}
            style={icon}
          />
        )}
      </View>
      <View style={textContainer}>
        <Text style={name}>{message.name}</Text>
        <Text style={size}>{formatBytes(message.size)}</Text>
      </View>
    </View>
  );
};
