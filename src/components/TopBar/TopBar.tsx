import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

import {styles} from './styles';

interface TopBarProps {
  modelName: string;
  onResetPress: () => void;
  onRelease: () => void;
  onLoad: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  modelName,
  onResetPress,
  onRelease,
  onLoad,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelectOption = (option: 'Release' | 'Load') => {
    setDropdownVisible(false);
    if (option === 'Release') {
      onRelease();
    } else if (option === 'Load') {
      setTimeout(() => {
        onLoad();
      }, 600);
    }
  };

  const truncateName = (name: string | undefined, length: number) => {
    if (!name) {
      return 'No Model Loaded';
    }
    return name.length > length ? `${name.substring(0, length)}...` : name;
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleToggleDropdown}
          style={styles.dropdown}>
          <Text style={styles.dropdownText}>{truncateName(modelName, 20)}</Text>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onResetPress} style={styles.editIcon}>
          <Icon name="edit" size={24} color="black" />
        </TouchableOpacity>

        <Modal
          isVisible={dropdownVisible}
          onBackdropPress={() => setDropdownVisible(false)}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0}
          style={styles.modalStyle}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => handleSelectOption('Release')}
              style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>Release</Text>
              <Icon
                name="eject"
                size={20}
                color="black"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => handleSelectOption('Load')}
              style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>Load</Text>
              <Icon
                name="upload-file"
                size={20}
                color="black"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
