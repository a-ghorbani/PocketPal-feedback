import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {CircularActivityIndicator} from '../CircularActivityIndicator';

import {MessageType, Theme} from '../../utils/types';

export const StatusIcon = React.memo(
  ({
    currentUserIsAuthor,
    showStatus,
    status,
    theme,
  }: {
    currentUserIsAuthor: boolean;
    showStatus: boolean;
    status?: MessageType.Any['status'];
    theme: Theme;
  }) => {
    let statusIcon: React.ReactNode | null = null;

    if (showStatus) {
      switch (status) {
        case 'delivered':
        case 'sent':
          statusIcon = theme.icons?.deliveredIcon?.() ?? (
            <Image
              source={require('../../assets/icon-delivered.png')}
              style={{tintColor: theme.colors.primary}}
              testID="DeliveredIcon"
            />
          );
          break;
        case 'error':
          statusIcon = theme.icons?.errorIcon?.() ?? (
            <Image
              source={require('../../assets/icon-error.png')}
              style={{tintColor: theme.colors.error}}
              testID="ErrorIcon"
            />
          );
          break;
        case 'seen':
          statusIcon = theme.icons?.seenIcon?.() ?? (
            <Image
              source={require('../../assets/icon-seen.png')}
              style={{tintColor: theme.colors.primary}}
              testID="SeenIcon"
            />
          );
          break;
        case 'sending':
          statusIcon = theme.icons?.sendingIcon?.() ?? (
            <CircularActivityIndicator color={theme.colors.primary} size={10} />
          );
          break;
        default:
          break;
      }
    }

    return currentUserIsAuthor ? (
      <View style={styles.container} testID="StatusIconContainer">
        {statusIcon}
      </View>
    ) : null;
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 16,
    justifyContent: 'center',
    paddingHorizontal: 4,
    width: 16,
  },
});
