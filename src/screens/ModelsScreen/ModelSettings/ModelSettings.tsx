import {TextInput as RNTextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {CompletionParams} from 'llama.rn';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {
  Button,
  TextInput,
  Chip,
  Dialog,
  Portal,
  Text,
  List,
} from 'react-native-paper';

import {useTheme} from '../../../hooks';

import {styles} from './styles';
import {ChatTemplatePicker} from '../ChatTemplatePicker';
import {CompletionSettings} from '../CompletionSettings';

import {ChatTemplateConfig} from '../../../utils/types';

interface ModelSettingsProps {
  chatTemplate: ChatTemplateConfig;
  completionSettings: CompletionParams;
  isActive: boolean;
  onChange: (name: string, value: any) => void;
  onCompletionSettingsChange: (name: string, value: any) => void;
}

export const ModelSettings: React.FC<ModelSettingsProps> = ({
  chatTemplate,
  completionSettings,
  isActive,
  onChange,
  onCompletionSettingsChange,
}) => {
  const [isDialogVisible, setDialogVisible] = useState<boolean>(false);
  const [localChatTemplate, setLocalChatTemplate] = useState(
    chatTemplate.chatTemplate,
  );
  const [localSystemPrompt, setLocalSystemPrompt] = useState(
    chatTemplate.systemPrompt,
  );
  const [selectedTemplateName, setSelectedTemplateName] = useState(
    chatTemplate.name,
  );

  const theme = useTheme();
  const textInputRef = useRef<RNTextInput>(null);
  const systemPromptTextInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    setSelectedTemplateName(chatTemplate.name);
  }, [chatTemplate.name]);

  useEffect(() => {
    setLocalChatTemplate(chatTemplate.chatTemplate);
  }, [chatTemplate.chatTemplate]);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({text: localChatTemplate});
    }
  }, [localChatTemplate]);

  useEffect(() => {
    setLocalSystemPrompt(chatTemplate.systemPrompt);
  }, [chatTemplate.systemPrompt]);

  useEffect(() => {
    if (systemPromptTextInputRef.current) {
      systemPromptTextInputRef.current.setNativeProps({
        text: localSystemPrompt,
      });
    }
  }, [localSystemPrompt]);

  const handleSave = () => {
    onChange('chatTemplate', localChatTemplate);
    setDialogVisible(false);
  };

  const handleSaveSystemPrompt = () => {
    onChange('systemPrompt', localSystemPrompt);
    setDialogVisible(false);
  };

  const handleChatTemplateNameChange = (chatTemplateName: string) => {
    setSelectedTemplateName(chatTemplateName);
    onChange('name', chatTemplateName);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container} testID="settings-container">
        <View style={styles.row}>
          <Chip
            selected={chatTemplate.addBosToken}
            onPress={() => onChange('addBosToken', !chatTemplate.addBosToken)}
            style={styles.chip}>
            Use BOS
          </Chip>
          <TextInput
            placeholder="BOS Token"
            value={chatTemplate.bosToken}
            onChangeText={text => onChange('bosToken', text)}
            style={styles.minimalInput}
            //disabled={!chatTemplate.addBosToken}
            dense
          />
        </View>
        <View style={styles.row}>
          <Chip
            selected={chatTemplate.addEosToken}
            onPress={() => onChange('addEosToken', !chatTemplate.addEosToken)}
            style={styles.chip}>
            Use EOS
          </Chip>
          <TextInput
            placeholder="EOS Token"
            value={chatTemplate.eosToken}
            onChangeText={text => onChange('eosToken', text)}
            style={styles.minimalInput}
            //disabled={!chatTemplate.addEosToken}
          />
        </View>
        <View style={styles.row}>
          <Chip
            selected={chatTemplate.addGenerationPrompt}
            onPress={() =>
              onChange('addGenerationPrompt', !chatTemplate.addGenerationPrompt)
            }
            style={styles.generationPromptChip}>
            Add Generation Prompt
          </Chip>
        </View>
        <View style={styles.chatTemplateRow}>
          <Text style={styles.chatTemplateLabel} variant="labelLarge">
            Template:
          </Text>
          <MaskedView
            style={styles.chatTemplateContainer}
            maskElement={
              <View style={styles.chatTemplateMaskContainer}>
                <Text variant="labelSmall" style={styles.chatTemplateText}>
                  {chatTemplate.chatTemplate.trim().slice(0, 30)}
                </Text>
              </View>
            }>
            <LinearGradient
              colors={[theme.colors.onSurface, 'transparent']}
              style={styles.gradient}
              start={{x: 0.7, y: 0}}
              end={{x: 1, y: 0}}
            />
          </MaskedView>
          <Button
            onPress={() => {
              setLocalChatTemplate(chatTemplate.chatTemplate);
              setDialogVisible(true);
            }}>
            Edit
          </Button>
        </View>
        <View>
          {chatTemplate.systemPrompt !== undefined &&
            chatTemplate.systemPrompt !== null && (
              <TextInput
                testID="system-prompt-input"
                ref={systemPromptTextInputRef}
                defaultValue={localSystemPrompt}
                onChangeText={text => setLocalSystemPrompt(text)}
                onBlur={() => handleSaveSystemPrompt()}
                multiline
                numberOfLines={3}
                style={styles.textArea}
                label={'System prompt'}
              />
            )}
        </View>
        {/** Completion Settings */}
        <List.Accordion
          title="Advanced Settings"
          style={[
            styles.accordion,
            isActive
              ? [
                  styles.active,
                  {backgroundColor: theme.colors.tertiaryContainer},
                ]
              : {backgroundColor: theme.colors.surface},
          ]}
          titleStyle={styles.accordionTitle}>
          <CompletionSettings
            settings={completionSettings}
            onChange={onCompletionSettingsChange}
          />
        </List.Accordion>

        <Portal>
          <Dialog
            visible={isDialogVisible}
            onDismiss={() => setDialogVisible(false)}
            style={styles.dialog}>
            <Dialog.Content>
              <View style={styles.pickerContainer}>
                <ChatTemplatePicker
                  selectedTemplateName={selectedTemplateName}
                  handleChatTemplateNameChange={handleChatTemplateNameChange}
                />
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                style={styles.scrollView}>
                <TextInput
                  ref={textInputRef}
                  placeholder="Enter your chat template here..."
                  defaultValue={localChatTemplate}
                  onChangeText={text => setLocalChatTemplate(text)}
                  multiline
                  numberOfLines={10}
                  style={styles.textArea}
                />
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
              <Button onPress={handleSave}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </TouchableWithoutFeedback>
  );
};
