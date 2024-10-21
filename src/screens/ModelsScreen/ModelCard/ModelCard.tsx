import React, {useCallback, useState} from 'react';
import {Linking, View} from 'react-native';

import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  Card,
  ProgressBar,
  Button,
  IconButton,
  Text,
  Paragraph,
  TouchableRipple,
  HelperText,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';

import {useTheme, useMemoryCheck, useStorageCheck} from '../../../hooks';

import {styles} from './styles';
import {ModelSettings} from '../ModelSettings';

import {uiStore, modelStore} from '../../../store';

import {chatTemplates} from '../../../utils/chat';
import {Model, RootDrawerParamList} from '../../../utils/types';
import {getModelDescription, L10nContext} from '../../../utils';

type ChatScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

interface ModelCardProps {
  model: Model;
  activeModelId?: string;
}

export const ModelCard: React.FC<ModelCardProps> = observer(
  ({model, activeModelId}) => {
    const l10n = React.useContext(L10nContext);
    const {colors} = useTheme();
    const navigation = useNavigation<ChatScreenNavigationProp>();

    const [expanded, setExpanded] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility

    const {memoryWarning, shortMemoryWarning} = useMemoryCheck(model);
    const {isOk: storageOk, message: storageNOkMessage} =
      useStorageCheck(model);

    const isActiveModel = activeModelId === model.id;
    const isDownloaded = model.isDownloaded;
    const isDownloading = modelStore.isDownloading(model.id);

    const handleSettingsUpdate = useCallback(
      (name: string, value: any) => {
        const chatTemplateConfig =
          name === 'name'
            ? chatTemplates[value]
            : {...model.chatTemplate, [name]: value};
        modelStore.updateModelChatTemplate(model.id, chatTemplateConfig);
      },
      [model.id, model.chatTemplate],
    );

    const handleCompletionSettingsUpdate = useCallback(
      (name: string, value: any) => {
        modelStore.updateCompletionSettings(model.id, {
          ...model.completionSettings,
          [name]: value,
        });
      },
      [model.id, model.completionSettings],
    );

    const handleReset = useCallback(() => {
      modelStore.resetModelChatTemplate(model.id);
      modelStore.resetCompletionSettings(model.id);
    }, [model.id]);

    const openHuggingFaceUrl = useCallback(() => {
      if (model.hfUrl) {
        Linking.openURL(model.hfUrl).catch(err => {
          console.error('Failed to open URL:', err);
          setSnackbarVisible(true);
        });
      }
    }, [model.hfUrl]);

    const renderDownloadOverlay = () => (
      <View style={styles.overlayContainer}>
        <View style={styles.overlay}>
          <HelperText
            testID="storage-error-text"
            type="error"
            visible={!storageOk}
            padding="none"
            style={styles.storageErrorText}>
            {storageNOkMessage}
          </HelperText>
          {storageOk && (
            <Button
              testID="download-button"
              icon="download"
              mode="text"
              onPress={() => modelStore.checkSpaceAndDownload(model.id)}
              disabled={!storageOk}
              style={styles.downloadButton}>
              Download
            </Button>
          )}
        </View>
      </View>
    );

    const renderModelLoadButton = () => {
      if (
        modelStore.isContextLoading &&
        modelStore.loadingModel?.id === model.id
      ) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              testID="loading-indicator"
              animating={true}
              color={colors.primary}
            />
          </View>
        );
      }

      const handlePress = () => {
        if (isActiveModel) {
          modelStore.manualReleaseContext();
        } else {
          modelStore
            .initContext(model)
            .then(() => {
              console.log('initialized');
            })
            .catch(e => {
              console.log(`Error: ${e}`);
            });
          if (uiStore.autoNavigatetoChat) {
            navigation.navigate('Chat');
          }
        }
      };

      return (
        <Button
          testID={isActiveModel ? 'offload-button' : 'load-button'}
          icon={isActiveModel ? 'eject' : 'play-circle-outline'}
          textColor={colors.onSurface}
          mode="text"
          onPress={handlePress}
          style={styles.actionButton}>
          {isActiveModel ? l10n.offload : l10n.load}
        </Button>
      );
    };

    const handleWarningPress = () => {
      setSnackbarVisible(true);
    };

    return (
      <>
        <Card
          style={[
            styles.card,
            {backgroundColor: colors.surface},
            isActiveModel && {backgroundColor: colors.tertiaryContainer},
            {borderColor: colors.primary},
          ]}>
          <View style={styles.cardInner}>
            <TouchableRipple
              testID={`model-card-header-${model.id}`}
              onPress={() => setExpanded(!expanded)}
              disabled={!isDownloaded}
              style={styles.touchableRipple}>
              <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                  <View style={styles.modelInfoContainer}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          styles.modelName,
                          !isDownloaded && styles.disabledText,
                        ]}>
                        {model.name}
                      </Text>
                      {model.hfUrl && (
                        <IconButton
                          testID="open-huggingface-url"
                          icon="open-in-new"
                          size={14}
                          onPress={openHuggingFaceUrl}
                          style={styles.hfButton}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.modelDescription,
                        {color: colors.outline},
                      ]}>
                      {getModelDescription(model, isActiveModel, modelStore)}
                    </Text>
                  </View>
                  {isDownloaded && (
                    <IconButton
                      icon={expanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      onPress={() => setExpanded(!expanded)}
                    />
                  )}
                </View>
              </View>
            </TouchableRipple>

            {/* Display warning icon if there's a memory warning */}
            {shortMemoryWarning && isDownloaded && (
              <TouchableRipple
                testID="memory-warning-button"
                onPress={handleWarningPress}
                style={styles.warningContainer}>
                <View style={styles.warningContent}>
                  <IconButton
                    icon="alert-circle-outline"
                    iconColor={colors.error}
                    size={20}
                    style={styles.warningIcon}
                  />
                  <Text style={styles.warningText}>{shortMemoryWarning}</Text>
                </View>
              </TouchableRipple>
            )}

            {isDownloading && (
              <>
                <ProgressBar
                  testID="download-progress-bar"
                  progress={modelStore.getDownloadProgress(model.id)}
                  color={colors.accent}
                  style={styles.progressBar}
                />
                {model.downloadSpeed && (
                  <Paragraph style={styles.downloadSpeed}>
                    {model.downloadSpeed}
                  </Paragraph>
                )}
              </>
            )}

            <View style={styles.settings}>
              {expanded && isDownloaded && (
                <ModelSettings
                  chatTemplate={model.chatTemplate}
                  completionSettings={model.completionSettings}
                  isActive={isActiveModel}
                  onChange={handleSettingsUpdate}
                  onCompletionSettingsChange={handleCompletionSettingsUpdate}
                />
              )}
            </View>

            {isDownloaded ? (
              <Card.Actions style={styles.actions}>
                <Button
                  testID="delete-button"
                  icon="delete"
                  mode="text"
                  textColor={colors.error}
                  onPress={() => modelStore.deleteModel(model.name)}
                  style={styles.actionButton}>
                  {l10n.delete}
                </Button>
                <Button
                  testID="reset-button"
                  icon="refresh"
                  mode="text"
                  textColor={colors.secondary}
                  onPress={handleReset}
                  style={styles.actionButton}>
                  {l10n.reset}
                </Button>
                {renderModelLoadButton()}
              </Card.Actions>
            ) : isDownloading ? (
              <Card.Actions style={styles.actions}>
                <Button
                  testID="cancel-button"
                  icon="cancel"
                  mode="outlined"
                  onPress={() => modelStore.cancelDownload(model.id)}
                  style={styles.button}>
                  {l10n.cancel}
                </Button>
              </Card.Actions>
            ) : (
              renderDownloadOverlay()
            )}
          </View>
        </Card>
        {/* Snackbar to show full memory warning */}
        <Snackbar
          testID="memory-warning-snackbar"
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_MEDIUM}
          action={{
            label: l10n.dismiss,
            onPress: () => {
              setSnackbarVisible(false);
            },
          }}>
          {memoryWarning}
        </Snackbar>
      </>
    );
  },
);
