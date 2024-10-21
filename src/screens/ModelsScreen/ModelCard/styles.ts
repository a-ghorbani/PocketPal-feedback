import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 13,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    padding: 15,
    borderRadius: 8,
    //elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    margin: 6,
    borderRadius: 15,
    borderWidth: 1,
  },
  touchableRipple: {
    zIndex: 1,
  },
  cardInner: {
    paddingHorizontal: 15,
    position: 'relative',
    minHeight: 115,
  },
  cardContent: {
    paddingTop: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginTop: 8,
  },
  actions: {
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  button: {
    flex: 1,
    elevation: 4,
  },
  actionButton: {
    width: '33%',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  downloadSpeed: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modelInfoContainer: {
    flex: 1,
    marginRight: 8,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  hfButton: {
    margin: 0,
    padding: 0,
    zIndex: 2,
  },
  settings: {
    //paddingHorizontal: 15,
  },
  disabledText: {
    color: '#777',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    marginLeft: 0,
    marginRight: 2,
  },
  warningText: {
    color: '#d32f2f', // Red color for the warning
    fontSize: 12,
  },
  downloadButton: {},
  storageErrorText: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 100,
  },
});
