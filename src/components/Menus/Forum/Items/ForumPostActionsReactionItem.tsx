import {useForumPostReactionMutation} from '../../../Queries/Forum/ForumPostBookmarkQueries';
import {PostData, PostDetailData} from '../../../../libraries/Structs/ControllerStructs';
import {LikeType} from '../../../../libraries/Enums/LikeType';
import {ActivityIndicator} from 'react-native-paper';
import {LaughReaction, LoveReaction, LikeReaction} from '../../../Text/Reactions';
import {View} from 'react-native';
import React from 'react';
import {useStyles} from '../../../Context/Contexts/StyleContext';
import {useUserData} from '../../../Context/Contexts/UserDataContext';
import {useForumPostQuery} from '../../../Queries/Forum/ForumPostQueries';
import {SubmitIconButton} from '../../../Buttons/IconButtons/SubmitIconButton';
import {useAppTheme} from '../../../../styles/Theme';

interface ForumPostActionsReactionItemProps {
  forumPost: PostData;
}

export const ForumPostActionsReactionItem = ({forumPost}: ForumPostActionsReactionItemProps) => {
  const reactionMutation = useForumPostReactionMutation();
  const {commonStyles} = useStyles();
  const {profilePublicData} = useUserData();
  const bySelf = profilePublicData?.header.userID === forumPost.author.userID;
  const {data, isLoading, refetch} = useForumPostQuery(forumPost.postID.toString());
  const theme = useAppTheme();

  if (isLoading || !data || !profilePublicData) {
    return (
      <View style={commonStyles.flexRow}>
        <ActivityIndicator />
      </View>
    );
  }

  const handleReaction = (newReaction: LikeType) => {
    let hasReacted = false;
    switch (newReaction) {
      case LikeType.like:
        hasReacted = PostDetailData.hasUserReacted(data, profilePublicData.header, LikeType.like);
        break;
      case LikeType.laugh:
        hasReacted = PostDetailData.hasUserReacted(data, profilePublicData.header, LikeType.laugh);
        break;
      case LikeType.love:
        hasReacted = PostDetailData.hasUserReacted(data, profilePublicData.header, LikeType.love);
        break;
    }
    const action = hasReacted ? 'delete' : 'create';
    reactionMutation.mutate(
      {
        postID: forumPost.postID.toString(),
        reaction: newReaction,
        action: action,
      },
      {
        onSuccess: () => {
          // @TODO this is a hack but processing all these static fields and types sucks.
          refetch();
        },
      },
    );
  };

  return (
    <View style={commonStyles.flexRow}>
      <SubmitIconButton
        icon={LikeReaction}
        onPress={() => handleReaction(LikeType.like)}
        submitting={reactionMutation.isLoading}
        disabled={bySelf}
        containerColor={
          PostDetailData.hasUserReacted(data, profilePublicData.header, LikeType.like)
            ? theme.colors.secondaryContainer
            : undefined
        }
      />
      <SubmitIconButton
        icon={LaughReaction}
        onPress={() => handleReaction(LikeType.laugh)}
        submitting={reactionMutation.isLoading}
        disabled={bySelf}
        containerColor={
          PostDetailData.hasUserReacted(data, profilePublicData.header, LikeType.laugh)
            ? theme.colors.secondaryContainer
            : undefined
        }
      />
      <SubmitIconButton
        icon={LoveReaction}
        onPress={() => handleReaction(LikeType.love)}
        submitting={reactionMutation.isLoading}
        disabled={bySelf}
        containerColor={
          PostDetailData.hasUserReacted(data, profilePublicData.header, LikeType.love)
            ? theme.colors.secondaryContainer
            : undefined
        }
      />
    </View>
  );
};
