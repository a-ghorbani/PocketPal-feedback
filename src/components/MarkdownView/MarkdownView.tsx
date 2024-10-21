import {SafeAreaView, ScrollView} from 'react-native';
import React, {useMemo} from 'react';

import {marked} from 'marked';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';

import {useTheme} from '../../hooks';

import {createTagsStyles, styles} from './styles';

marked.use({
  langPrefix: 'language-',
  mangle: false,
  headerIds: false,
});

interface MarkdownViewProps {
  markdownText: string;
  maxMessageWidth: number;
  //isComplete: boolean; // indicating if message is complete
}

export const MarkdownView: React.FC<MarkdownViewProps> = React.memo(
  ({markdownText, maxMessageWidth}) => {
    const _maxWidth = maxMessageWidth;

    const theme = useTheme();
    const tagsStyles = useMemo(() => createTagsStyles(theme), [theme]);

    const defaultTextProps = useMemo(() => ({selectable: true}), []);
    const systemFonts = useMemo(() => defaultSystemFonts, []);

    const contentWidth = useMemo(() => _maxWidth, [_maxWidth]);

    //if (!isComplete) {
    //  // During streaming, use Text component
    //  return (
    //    <SafeAreaView style={styles.container}>
    //      <ScrollView style={{maxWidth: _maxWidth}}>
    //        <Text style={{color: theme.colors.text}}>{markdownText}</Text>
    //      </ScrollView>
    //    </SafeAreaView>
    //  );
    //}

    const htmlContent = useMemo(() => marked(markdownText), [markdownText]);
    const source = useMemo(() => ({html: htmlContent}), [htmlContent]);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          testID="chatMarkdownScrollView"
          style={{maxWidth: _maxWidth}}>
          <RenderHtml
            contentWidth={contentWidth}
            source={source}
            tagsStyles={tagsStyles}
            defaultTextProps={defaultTextProps}
            systemFonts={systemFonts}
          />
        </ScrollView>
      </SafeAreaView>
    );
  },
  (prevProps, nextProps) =>
    prevProps.markdownText === nextProps.markdownText &&
    //prevProps.isComplete === nextProps.isComplete &&
    prevProps.maxMessageWidth === nextProps.maxMessageWidth,
);
