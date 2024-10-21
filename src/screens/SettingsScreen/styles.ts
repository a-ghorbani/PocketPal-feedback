import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginVertical: 10,
  },
  settingItemContainer: {
    marginVertical: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  textContainer: {
    flex: 1,
  },
  textLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  textDescription: {
    fontSize: 14,
    marginRight: 2,
  },
  textInput: {
    marginVertical: 5,
  },
  nGPUSlider: {
    marginTop: 1,
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
