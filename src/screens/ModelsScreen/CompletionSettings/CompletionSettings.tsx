import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';

import {CompletionParams} from 'llama.rn';
import Slider from '@react-native-community/slider';
import {Card, Text, Switch, TextInput, Divider, Chip} from 'react-native-paper';

import {useTheme} from '../../../hooks';

import {styles} from './styles';

interface Props {
  settings: CompletionParams;
  onChange: (name: string, value: any) => void;
}

export const CompletionSettings: React.FC<Props> = ({settings, onChange}) => {
  const [localSliderValues, setLocalSliderValues] = useState({});
  const {colors} = useTheme();

  const handleOnChange = (name, value) => {
    onChange(name, value);
  };

  const renderSlider = (
    name: string,
    min: number,
    max: number,
    step: number = 0.01,
  ) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{name}</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={localSliderValues[name] ?? settings[name]}
        onValueChange={value => {
          setLocalSliderValues(prev => ({...prev, [name]: value}));
        }}
        onSlidingComplete={value => {
          handleOnChange(name, value);
        }}
        thumbTintColor={colors.primary}
        minimumTrackTintColor={colors.primary}
        //onValueChange={value => onChange(name, value)}
        testID={`${name}-slider`}
      />
      <Text style={styles.settingValue}>
        {Number.isInteger(step)
          ? Math.round(localSliderValues[name] ?? settings[name]).toString()
          : (localSliderValues[name] ?? settings[name]).toFixed(2)}
      </Text>
    </View>
  );

  const renderIntegerInput = (name: string, min: number, max: number) => (
    <View style={styles.settingItem}>
      {/*<Text style={styles.settingLabel}>{name}</Text>*/}
      <TextInput
        value={settings[name].toString()}
        mode="outlined"
        label={name}
        onChangeText={value => {
          const intValue = parseInt(value, 10);
          if (!isNaN(intValue)) {
            onChange(name, Math.max(min, Math.min(max, intValue)));
          }
        }}
        keyboardType="numeric"
        style={styles.textInput}
        contentStyle={styles.textInputContent}
        /*left={<TextInput.Affix text={name} textStyle={styles.inputLabel} />}*/
        testID={`${name}-input`}
      />
    </View>
  );

  const renderSwitch = (name: string) => (
    <View style={[styles.settingItem, styles.row]}>
      <Text style={styles.settingLabel}>{name}</Text>
      <Switch
        value={settings[name]}
        onValueChange={value => onChange(name, value)}
        testID={`${name}-switch`}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Card.Content>
          {renderIntegerInput('n_predict', 0, 2048)}
          {renderSlider('temperature', 0, 1)}
          {renderSlider('top_k', 1, 128, 1)}
          {renderSlider('top_p', 0, 1)}
          {renderSlider('tfs_z', 0, 2)}
          {renderSlider('typical_p', 0, 2)}
          {renderSlider('penalty_last_n', 0, 256, 1)}
          {renderSlider('penalty_repeat', 0, 2)}
          {renderSlider('penalty_freq', 0, 2)}
          {renderSlider('penalty_present', 0, 2)}
          <Divider style={styles.divider} />
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>mirostat</Text>
            <View style={styles.chipContainer}>
              {[0, 1, 2].map(value => (
                <Chip
                  key={value}
                  selected={settings.mirostat === value}
                  onPress={() => onChange('mirostat', value)}
                  style={styles.chip}>
                  {value.toString()}
                </Chip>
              ))}
            </View>
          </View>
          {renderSlider('mirostat_tau', 0, 10, 1)}
          {renderSlider('mirostat_eta', 0, 1)}
          {renderSwitch('penalize_nl')}
          {renderIntegerInput('seed', 0, Number.MAX_SAFE_INTEGER)}
          {renderIntegerInput('n_probs', 0, 100)}
          <View style={styles.settingItem}>
            <View style={styles.stopLabel}>
              <Text style={styles.settingLabel}>stop</Text>
              <Text>(comma separated)</Text>
            </View>
            <TextInput
              value={settings.stop?.join(', ')}
              onChangeText={value =>
                onChange(
                  'stop',
                  value.split(',').map(s => s.trim()),
                )
              }
              style={styles.textInput}
              testID="stop-input"
            />
          </View>
        </Card.Content>
      </View>
    </ScrollView>
  );
};
