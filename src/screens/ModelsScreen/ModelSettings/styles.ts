import {Dimensions, StyleSheet} from 'react-native';

const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chip: {
    width: 100, // Fixed width for BOS and EOS chips
    marginRight: 10,
  },
  generationPromptChip: {
    //width: 220, // Fixed width for Add Generation Prompt chip
    marginRight: 10,
  },
  minimalInput: {
    flex: 1,
    height: 40, // Reduced height to match chip height
    //backgroundColor: 'white',
    borderWidth: 1,
    //borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  chatTemplateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatTemplateLabel: {
    flex: 1,
  },
  chatTemplateContainer: {
    flex: 2,
    height: 20,
    overflow: 'hidden',
  },
  chatTemplateMaskContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  chatTemplateText: {
    //color: '#f1f1f1',
  },
  gradient: {
    flex: 1,
  },
  dialog: {
    //minHeight: 200,
    //maxHeight: '90%',
    //borderRadius: 10,
  },
  textArea: {
    //minHeight: 200,
    //backgroundColor: 'white',
    //borderWidth: 1,
    //borderColor: '#ddd',
    //borderRadius: 8,
    //paddingHorizontal: 15,
    // paddingVertical: 0,
    //textAlignVertical: 'top', // Ensures the text is aligned at the top
    fontSize: 12,
    //color: '#333',
    lineHeight: 16,
  },
  scrollView: {
    maxHeight: screenHeight * 0.4,
  },
  scrollViewContent: {
    //paddingVertical: 5,
  },
  cancelButton: {
    marginRight: 10,
  },
  saveButton: {
    //backgroundColor: '#6200ea',
  },
  pickerContainer: {
    //borderWidth: 1,
    //height: 10,
    //borderColor: '#ccc',
    //borderRadius: 5,
    //overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  active: {
    //backgroundColor: '#e8f5e9', // Light green background to indicate an active model
  },
  accordion: {
    padding: 0,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
