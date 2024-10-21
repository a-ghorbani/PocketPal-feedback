import * as React from 'react';
import {ColorValue, ImageURISource, TextStyle} from 'react-native';

import {MD3Theme} from 'react-native-paper';
import {TemplateConfig} from 'chat-formatter';
import {CompletionParams, TokenData} from 'llama.rn';
import {PreviewData} from '@flyerhq/react-native-link-preview';
import {MD3Colors, MD3Typescale} from 'react-native-paper/lib/typescript/types';

export namespace MessageType {
  export type Any = Custom | File | Image | Text | Unsupported;

  export type DerivedMessage =
    | DerivedCustom
    | DerivedFile
    | DerivedImage
    | DerivedText
    | DerivedUnsupported;
  export type DerivedAny = DateHeader | DerivedMessage;

  export type PartialAny =
    | PartialCustom
    | PartialFile
    | PartialImage
    | PartialText;

  interface Base {
    author: User;
    createdAt?: number;
    id: string;
    metadata?: Record<string, any>;
    roomId?: string;
    status?: 'delivered' | 'error' | 'seen' | 'sending' | 'sent';
    type: 'custom' | 'file' | 'image' | 'text' | 'unsupported';
    updatedAt?: number;
  }

  export interface DerivedMessageProps extends Base {
    nextMessageInGroup: boolean;
    // TODO: Check name?
    offset: number;
    showName: boolean;
    showStatus: boolean;
  }

  export interface DerivedCustom extends DerivedMessageProps, Custom {
    type: Custom['type'];
  }

  export interface DerivedFile extends DerivedMessageProps, File {
    type: File['type'];
  }

  export interface DerivedImage extends DerivedMessageProps, Image {
    type: Image['type'];
  }

  export interface DerivedText extends DerivedMessageProps, Text {
    type: Text['type'];
  }

  export interface DerivedUnsupported extends DerivedMessageProps, Unsupported {
    type: Unsupported['type'];
  }

  export interface PartialCustom extends Base {
    metadata?: Record<string, any>;
    type: 'custom';
  }

  export interface Custom extends Base, PartialCustom {
    type: 'custom';
  }

  export interface PartialFile {
    metadata?: Record<string, any>;
    mimeType?: string;
    name: string;
    size: number;
    type: 'file';
    uri: string;
  }

  export interface File extends Base, PartialFile {
    type: 'file';
  }

  export interface PartialImage {
    height?: number;
    metadata?: Record<string, any>;
    name: string;
    size: number;
    type: 'image';
    uri: string;
    width?: number;
  }

  export interface Image extends Base, PartialImage {
    type: 'image';
  }

  export interface PartialText {
    metadata?: Record<string, any>;
    previewData?: PreviewData;
    text: string;
    type: 'text';
  }

  export interface Text extends Base, PartialText {
    type: 'text';
  }

  export interface Unsupported extends Base {
    type: 'unsupported';
  }

  export interface DateHeader {
    id: string;
    text: string;
    type: 'dateHeader';
  }
}

export interface PreviewImage {
  id: string;
  uri: ImageURISource['uri'];
}

export interface Size {
  height: number;
  width: number;
}

export interface Colors extends MD3Colors {
  accent: string;
  outlineVariant: string;
  receivedMessageDocumentIcon: string;
  sentMessageDocumentIcon: string;
  userAvatarImageBackground: string;
  userAvatarNameColors: ColorValue[];
}

export interface Typescale extends MD3Typescale {
  dateDividerTextStyle?: TextStyle; // Optional custom styles
  emptyChatPlaceholderTextStyle?: TextStyle;
  inputTextStyle?: TextStyle;
  receivedMessageBodyTextStyle?: TextStyle;
  receivedMessageCaptionTextStyle?: TextStyle;
  receivedMessageLinkDescriptionTextStyle?: TextStyle;
  receivedMessageLinkTitleTextStyle?: TextStyle;
  sentMessageBodyTextStyle?: TextStyle;
  sentMessageCaptionTextStyle?: TextStyle;
  sentMessageLinkDescriptionTextStyle?: TextStyle;
  sentMessageLinkTitleTextStyle?: TextStyle;
  userAvatarTextStyle?: TextStyle;
  userNameTextStyle?: TextStyle;
}

export interface ThemeBorders {
  inputBorderRadius: number;
  messageBorderRadius: number;
}

export interface ThemeIcons {
  attachmentButtonIcon?: () => React.ReactNode;
  deliveredIcon?: () => React.ReactNode;
  documentIcon?: () => React.ReactNode;
  errorIcon?: () => React.ReactNode;
  seenIcon?: () => React.ReactNode;
  sendButtonIcon?: () => React.ReactNode;
  sendingIcon?: () => React.ReactNode;
}

export interface ThemeInsets {
  messageInsetsHorizontal: number;
  messageInsetsVertical: number;
}

export interface Theme extends MD3Theme {
  colors: Colors;
  fonts: Typescale;
  borders: ThemeBorders;
  insets: ThemeInsets;
  icons?: ThemeIcons;
}

export interface User {
  createdAt?: number;
  firstName?: string;
  id: string;
  imageUrl?: ImageURISource['uri'];
  lastName?: string;
  lastSeen?: number;
  metadata?: Record<string, any>;
  role?: 'admin' | 'agent' | 'moderator' | 'user';
  updatedAt?: number;
}

export interface ChatTemplateConfig extends TemplateConfig {
  addGenerationPrompt: boolean;
  systemPrompt?: string;
  name: string;
}

export type ChatMessage = {
  role: 'system' | 'assistant' | 'user';
  content: string;
};

export interface Model {
  id: string;
  name: string;
  type?: string;
  size: string; // Size in GB
  params: string; // in Billion
  isDownloaded: boolean;
  downloadUrl: string;
  hfUrl: string;
  progress: number; // Progress as a percentage
  downloadSpeed?: string;
  filename: string;
  fullPath?: string; // Full path for local models
  isLocal: boolean; // True if the model is manually added
  defaultChatTemplate: ChatTemplateConfig;
  chatTemplate: ChatTemplateConfig;
  defaultCompletionSettings: CompletionParams;
  completionSettings: CompletionParams;
}

export type RootDrawerParamList = {
  Chat: undefined;
  Models: undefined;
  Settings: undefined;
};

export type TokenNativeEvent = {
  contextId: number;
  tokenResult: TokenData;
};
