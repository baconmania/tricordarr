import {useErrorHandler} from '../../Context/Contexts/ErrorHandlerContext';
import {useModal} from '../../Context/Contexts/ModalContext';
import {useAppTheme} from '../../../styles/Theme';
import {PrimaryActionButton} from '../../Buttons/PrimaryActionButton';
import {View} from 'react-native';
import {ModalCard} from '../../Cards/ModalCard';
import React from 'react';
import {FezData} from '../../../libraries/Structs/ControllerStructs';
import {Text} from 'react-native-paper';
import {useStyles} from '../../Context/Contexts/StyleContext';
import {useTwitarr} from '../../Context/Contexts/TwitarrContext';
import {useFezCancelMutation} from '../../Queries/Fez/FezQueries';

const ModalContent = () => {
  const {commonStyles} = useStyles();
  return (
    <>
      <Text style={[commonStyles.marginBottomSmall]}>
        Cancelling the LFG will mark the LFG as not happening and notify all participants. The LFG won't be deleted;
        participants can still create and read posts.
      </Text>
      <Text style={[commonStyles.marginBottomSmall]}>
        If you haven't, you may want to make a post letting participants know why the event was cancelled.
      </Text>
    </>
  );
};

export const LfgCancelModal = ({fezData}: {fezData: FezData}) => {
  const {setErrorMessage} = useErrorHandler();
  const {setModalVisible} = useModal();
  const theme = useAppTheme();
  const cancelMutation = useFezCancelMutation();
  const {setFez} = useTwitarr();

  const onSubmit = () => {
    cancelMutation.mutate(
      {
        fezID: fezData.fezID,
      },
      {
        onSuccess: response => {
          setErrorMessage('Successfully canceled this LFG.');
          setFez(response.data);
          setModalVisible(false);
        },
        onError: error => {
          setErrorMessage(error.response?.data.reason);
        },
      },
    );
  };

  const cardActions = (
    <PrimaryActionButton
      buttonColor={theme.colors.twitarrNegativeButton}
      buttonText={'Cancel'}
      onPress={onSubmit}
      isLoading={cancelMutation.isLoading}
      disabled={cancelMutation.isLoading}
    />
  );

  return (
    <View>
      <ModalCard title={'Cancel'} closeButtonText={'Close'} content={<ModalContent />} actions={cardActions} />
    </View>
  );
};
