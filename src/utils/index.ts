import * as React from 'react';
import {ColorValue} from 'react-native';

import dayjs from 'dayjs';
import {MD3Theme} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import Blob from 'react-native/Libraries/Blob/Blob';

import {l10n} from './l10n';
import {MessageType, Model, PreviewImage, User} from './types';

export const L10nContext = React.createContext<
  (typeof l10n)[keyof typeof l10n]
>(l10n.en);
export const UserContext = React.createContext<User | undefined>(undefined);

/** Returns text representation of a provided bytes value (e.g. 1kB, 1GB) */
export const formatBytes = (size: number, fractionDigits = 2) => {
  if (size <= 0) {
    return '0 B';
  }
  const multiple = Math.floor(Math.log(size) / Math.log(1024));
  return (
    parseFloat((size / Math.pow(1024, multiple)).toFixed(fractionDigits)) +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][multiple]
  );
};

/** Returns size in bytes of the provided text */
export const getTextSizeInBytes = (text: string) => new Blob([text]).size;

/** Returns theme colors as ColorValue array */
export const getThemeColorsAsArray = (theme: MD3Theme): ColorValue[] => {
  const colors = theme.colors;
  return Object.values(colors) as ColorValue[];
};

/** Returns user avatar and name color based on the ID */
export const getUserAvatarNameColor = (user: User, colors: ColorValue[]) =>
  colors[hashCode(user.id) % colors.length];

/** Returns user initials (can have only first letter of firstName/lastName or both) */
export const getUserInitials = ({firstName, lastName}: User) =>
  `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`
    .toUpperCase()
    .trim();

/** Returns user name as joined firstName and lastName */
export const getUserName = ({firstName, lastName}: User) =>
  `${firstName ?? ''} ${lastName ?? ''}`.trim();

/** Returns hash code of the provided text */
export const hashCode = (text = '') => {
  let i,
    chr,
    hash = 0;
  if (text.length === 0) {
    return hash;
  }
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/** Inits dayjs locale */
export const initLocale = (locale?: keyof typeof l10n) => {
  const locales: {[key in keyof typeof l10n]: unknown} = {
    en: require('dayjs/locale/en'),
    es: require('dayjs/locale/es'),
    ko: require('dayjs/locale/ko'),
    pl: require('dayjs/locale/pl'),
    pt: require('dayjs/locale/pt'),
    ru: require('dayjs/locale/ru'),
    tr: require('dayjs/locale/tr'),
    uk: require('dayjs/locale/uk'),
  };

  locale ? locales[locale] : locales.en;
  dayjs.locale(locale);
};

/** Returns either prop or empty object if null or undefined */
export const unwrap = <T>(prop: T) => prop ?? {};

/** Returns formatted date used as a divider between different days in the chat history */
const getVerboseDateTimeRepresentation = (
  dateTime: number,
  {
    dateFormat,
    timeFormat,
  }: {
    dateFormat?: string;
    timeFormat?: string;
  },
) => {
  const formattedDate = dateFormat
    ? dayjs(dateTime).format(dateFormat)
    : dayjs(dateTime).format('MMM D');

  const formattedTime = timeFormat
    ? dayjs(dateTime).format(timeFormat)
    : dayjs(dateTime).format('HH:mm');

  const localDateTime = dayjs(dateTime);
  const now = dayjs();

  if (
    localDateTime.isSame(now, 'day') &&
    localDateTime.isSame(now, 'month') &&
    localDateTime.isSame(now, 'year')
  ) {
    return formattedTime;
  }

  return `${formattedDate}, ${formattedTime}`;
};

/** Parses provided messages to chat messages (with headers) and returns them with a gallery */
export const calculateChatMessages = (
  messages: MessageType.Any[],
  user: User,
  {
    customDateHeaderText,
    dateFormat,
    showUserNames,
    timeFormat,
  }: {
    customDateHeaderText?: (dateTime: number) => string;
    dateFormat?: string;
    showUserNames: boolean;
    timeFormat?: string;
  },
) => {
  let chatMessages: MessageType.DerivedAny[] = [];
  let gallery: PreviewImage[] = [];

  let shouldShowName = false;

  for (let i = messages.length - 1; i >= 0; i--) {
    const isFirst = i === messages.length - 1;
    const isLast = i === 0;
    const message = messages[i];
    const messageHasCreatedAt = !!message.createdAt;
    const nextMessage = isLast ? undefined : messages[i - 1];
    const nextMessageHasCreatedAt = !!nextMessage?.createdAt;
    const nextMessageSameAuthor = message.author.id === nextMessage?.author.id;
    const notMyMessage = message.author.id !== user.id;

    let nextMessageDateThreshold = false;
    let nextMessageDifferentDay = false;
    let nextMessageInGroup = false;
    let showName = false;

    if (showUserNames) {
      const previousMessage = isFirst ? undefined : messages[i + 1];

      const isFirstInGroup =
        notMyMessage &&
        (message.author.id !== previousMessage?.author.id ||
          (messageHasCreatedAt &&
            !!previousMessage?.createdAt &&
            message.createdAt! - previousMessage!.createdAt! > 60000));

      if (isFirstInGroup) {
        shouldShowName = false;
        if (message.type === 'text') {
          showName = true;
        } else {
          shouldShowName = true;
        }
      }

      if (message.type === 'text' && shouldShowName) {
        showName = true;
        shouldShowName = false;
      }
    }

    if (messageHasCreatedAt && nextMessageHasCreatedAt) {
      nextMessageDateThreshold =
        nextMessage!.createdAt! - message.createdAt! >= 900000;

      nextMessageDifferentDay = !dayjs(message.createdAt!).isSame(
        nextMessage!.createdAt!,
        'day',
      );

      nextMessageInGroup =
        nextMessageSameAuthor &&
        nextMessage!.createdAt! - message.createdAt! <= 60000;
    }

    if (isFirst && messageHasCreatedAt) {
      const text =
        customDateHeaderText?.(message.createdAt!) ??
        getVerboseDateTimeRepresentation(message.createdAt!, {
          dateFormat,
          timeFormat,
        });
      chatMessages = [{id: text, text, type: 'dateHeader'}, ...chatMessages];
    }

    chatMessages = [
      {
        ...message,
        nextMessageInGroup,
        // TODO: Check this
        offset: !nextMessageInGroup ? 12 : 0,
        showName:
          notMyMessage &&
          showUserNames &&
          showName &&
          !!getUserName(message.author),
        showStatus: true,
      },
      ...chatMessages,
    ];

    if (nextMessageDifferentDay || nextMessageDateThreshold) {
      const text =
        customDateHeaderText?.(nextMessage!.createdAt!) ??
        getVerboseDateTimeRepresentation(nextMessage!.createdAt!, {
          dateFormat,
          timeFormat,
        });

      chatMessages = [
        {
          id: text,
          text,
          type: 'dateHeader',
        },
        ...chatMessages,
      ];
    }

    if (message.type === 'image') {
      gallery = [...gallery, {id: message.id, uri: message.uri}];
    }
  }

  return {
    chatMessages,
    gallery,
  };
};

/** Removes all derived message props from the derived message */
export const excludeDerivedMessageProps = (
  message: MessageType.DerivedMessage,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {nextMessageInGroup, offset, showName, showStatus, ...rest} = message;
  return {...rest} as MessageType.Any;
};

export function roundToBillion(num: number) {
  const billion = 1e9;
  return Math.round((num / billion) * 10) / 10;
}

export function bytesToGB(bytes: number): string {
  const bytesPerGiB = 1000 ** 3; // 1 GiB = 1024^3 bytes
  const gib = bytes / bytesPerGiB;
  return gib.toFixed(2); // Convert to string with 2 decimal places
}

export const getModelDescription = (
  model: Model,
  isActiveModel: boolean,
  modelStore: any,
): string => {
  let size: string;
  let params: string;

  if (isActiveModel && modelStore.context?.model) {
    size = `${bytesToGB((modelStore.context.model as any).size)} GB`;
    params = `${roundToBillion((modelStore.context.model as any).nParams)} B`;
  } else {
    size = `${model.size} GB`;
    params = model.params ? `${model.params} B` : 'N/A';
  }

  return `Size: ${size} | Parameters: ${params}`;
};

export async function hasEnoughSpace(model: Model): Promise<boolean> {
  try {
    const requiredSizeGB = parseFloat(model.size);

    if (isNaN(requiredSizeGB) || requiredSizeGB <= 0) {
      console.error('Invalid model size:', model.size);
      return false;
    }

    // Convert size from GB to bytes + buffer
    const requiredSpaceBytes = requiredSizeGB * 1e9 + 1e7;

    const freeDiskBytes = await DeviceInfo.getFreeDiskStorage('important');
    // console.log('Free disk space:', freeDiskBytes);

    return requiredSpaceBytes <= freeDiskBytes;
  } catch (error) {
    console.error('Error fetching free disk space:', error);
    return false;
  }
}

export const randId = () => Math.random().toString(36).substring(2, 11);
