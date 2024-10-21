import {StyleSheet} from 'react-native';

import {Theme} from '../../utils/types';

export const createTagsStyles = (theme: Theme) => ({
  body: {
    color: theme.colors.onSurface,
    fontSize: 16,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: 0,
    paddingTop: 0,
    margin: 0,
    backgroundColor: 'transparent',
    // display: 'inline-block',
  },
  code: {
    fontFamily: 'Courier', // Change the font for code snippets
    backgroundColor: theme.colors.surface, // Custom background for code blocks
    padding: 4,
    borderRadius: 4,
    color: theme.colors.onSurface, // Color for code text
    fontSize: 12,
  },
  pre: {
    backgroundColor: theme.colors.surface, // Background for pre blocks
    padding: 8,
    borderRadius: 6,
    color: theme.colors.onPrimaryContainer,
    fontFamily: 'Courier',
    fontSize: 14,
    // overflow: 'scroll', // Ensure scrolling for long code blocks
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
