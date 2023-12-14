import React from 'react';
import {View} from 'react-native';
import {UserHeader} from '../../../libraries/Structs/ControllerStructs';
import {ModalCard} from '../../Cards/ModalCard';
import {useModal} from '../../Context/Contexts/ModalContext';
import {useUserBlockMutation} from '../../Queries/Users/UserBlockQueries';
import {PrimaryActionButton} from '../../Buttons/PrimaryActionButton';
import {useAppTheme} from '../../../styles/Theme';
import {useUserRelations} from '../../Context/Contexts/UserRelationsContext';
import {usePrivilege} from '../../Context/Contexts/PrivilegeContext';
import {ModeratorBlockText, UserBlockText} from '../../Text/UserRelationsText';

interface BlockUserModalViewProps {
  user: UserHeader;
}

const BlockUserModalContent = () => {
  const {hasModerator} = usePrivilege();
  return (
    <>
      <UserBlockText />
      {hasModerator && <ModeratorBlockText />}
    </>
  );
};

export const BlockUserModalView = ({user}: BlockUserModalViewProps) => {
  const blockMutation = useUserBlockMutation();
  const {setModalVisible} = useModal();
  const theme = useAppTheme();
  const {blocks, setBlocks} = useUserRelations();

  const onSubmit = () => {
    blockMutation.mutate(
      {
        userID: user.userID,
        action: 'block',
      },
      {
        onSuccess: () => {
          setBlocks(blocks.concat([user]));
          setModalVisible(false);
        },
      },
    );
  };

  const cardActions = (
    <PrimaryActionButton
      buttonColor={theme.colors.twitarrNegativeButton}
      buttonText={'Block'}
      onPress={onSubmit}
      isLoading={blockMutation.isLoading}
      disabled={blockMutation.isLoading}
    />
  );

  return (
    <View>
      <ModalCard title={'Block'} closeButtonText={'Cancel'} content={<BlockUserModalContent />} actions={cardActions} />
    </View>
  );
};
