import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    paddingBottom: 150,
  },
  filterContainer: {
    marginVertical: 15,
    marginHorizontal: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
  fabTop: {
    bottom: 90, // Ensure the top FAB is positioned slightly higher
  },
  fabBottom: {
    bottom: 25, // Keep the bottom FAB at the lowest position
  },
  paragraph: {
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
});
