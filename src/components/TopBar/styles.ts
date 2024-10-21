import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    zIndex: 1,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 18,
    color: 'black',
    marginRight: 5,
  },
  dropdownItem: {
    flexDirection: 'row', // Aligns icon and text horizontally
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdownIcon: {
    marginRight: 8, // Adjust this to align icon with text
  },
  editIcon: {
    marginRight: 10,
  },
  modalStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    //margin: 0, // Keep this to remove padding
    paddingTop: 70, // Adjust if needed to position the dropdown
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownMenu: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  dropdownItemText: {
    fontSize: 16,
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
});
