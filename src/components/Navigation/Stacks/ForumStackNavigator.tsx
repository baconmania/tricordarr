import React from 'react';
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ForumStackComponents} from '../../../libraries/Enums/Navigation';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useStyles} from '../../Context/Contexts/StyleContext';
import {useDrawer} from '../../Context/Contexts/DrawerContext';
import {useFeature} from '../../Context/Contexts/FeatureContext';
import {SwiftarrFeature} from '../../../libraries/Enums/AppFeatures';
import {DisabledView} from '../../Views/Static/DisabledView';
import {ForumCategoriesScreen} from '../../Screens/Forum/ForumCategoriesScreen';
import {ForumCategoryScreen} from '../../Screens/Forum/ForumCategoryScreen';
import {ForumPostMentionScreen} from '../../Screens/Forum/Post/ForumPostMentionScreen';
import {ForumPostSelfScreen} from '../../Screens/Forum/Post/ForumPostSelfScreen';
import {ForumPostFavoriteScreen} from '../../Screens/Forum/Post/ForumPostFavoriteScreen';
import {ForumThreadFavoritesScreen} from '../../Screens/Forum/Thread/ForumThreadFavoritesScreen';
import {ForumThreadMutesScreen} from '../../Screens/Forum/Thread/ForumThreadMutesScreen';
import {ForumThreadOwnedScreen} from '../../Screens/Forum/Thread/ForumThreadOwnedScreen';
import {ForumThreadRecentScreen} from '../../Screens/Forum/Thread/ForumThreadRecentScreen';
import {ForumPostSearchScreen} from '../../Screens/Forum/Post/ForumPostSearchScreen';
import {ForumThreadSearchScreen} from '../../Screens/Forum/Thread/ForumThreadSearchScreen';
import {ForumThreadCreateScreen} from '../../Screens/Forum/Thread/ForumThreadCreateScreen';
import {ForumPostAlertwordScreen} from '../../Screens/Forum/Post/ForumPostAlertwordScreen';
import {CommonScreens, CommonStackParamList} from '../CommonScreens';
import {MainStack} from './MainStackNavigator';
import {useErrorHandler} from '../../Context/Contexts/ErrorHandlerContext.ts';

export type ForumStackParamList = CommonStackParamList & {
  ForumCategoriesScreen: undefined;
  ForumCategoryScreen: {
    categoryID: string;
  };
  ForumPostMentionScreen: undefined;
  ForumPostSelfScreen: undefined;
  ForumPostFavoriteScreen: undefined;
  ForumFavoritesScreen: undefined;
  ForumMutesScreen: undefined;
  ForumOwnedScreen: undefined;
  ForumRecentScreen: undefined;
  ForumPostSearchScreen: undefined;
  ForumPostAlertwordScreen: {
    alertWord: string;
  };
  ForumThreadSearchScreen: {
    categoryID?: string;
  };
  ForumThreadCreateScreen: {
    categoryId: string;
  };
};

export const ForumStackNavigator = () => {
  const {screenOptions} = useStyles();
  const Stack = createNativeStackNavigator<ForumStackParamList>();
  const {getLeftMainHeaderButtons} = useDrawer();
  const {getIsDisabled} = useFeature();
  const isDisabled = getIsDisabled(SwiftarrFeature.forums);
  const {setHasUnsavedWork} = useErrorHandler();

  return (
    <Stack.Navigator
      initialRouteName={ForumStackComponents.forumCategoriesScreen}
      screenOptions={{...screenOptions, headerShown: true}}
      screenListeners={{
        state: () => {
          console.log('[ForumStackNavigator.tsx] Clearing unsaved work.');
          setHasUnsavedWork(false);
        },
      }}>
      <Stack.Screen
        name={ForumStackComponents.forumCategoriesScreen}
        component={isDisabled ? DisabledView : ForumCategoriesScreen}
        options={{
          headerLeft: getLeftMainHeaderButtons,
          title: 'Forum Categories',
        }}
      />
      <Stack.Screen
        name={ForumStackComponents.forumCategoryScreen}
        component={isDisabled ? DisabledView : ForumCategoryScreen}
        options={{
          title: 'Forums',
        }}
      />
      <Stack.Screen
        name={ForumStackComponents.forumPostMentionScreen}
        component={isDisabled ? DisabledView : ForumPostMentionScreen}
        options={{title: 'Posts Mentioning You'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumPostSelfScreen}
        component={isDisabled ? DisabledView : ForumPostSelfScreen}
        options={{title: 'Your Posts'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumPostFavoriteScreen}
        component={isDisabled ? DisabledView : ForumPostFavoriteScreen}
        options={{title: 'Favorite Posts'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumFavoritesScreen}
        component={isDisabled ? DisabledView : ForumThreadFavoritesScreen}
        options={{title: 'Favorite Forums'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumMutesScreen}
        component={isDisabled ? DisabledView : ForumThreadMutesScreen}
        options={{title: 'Muted Forums'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumOwnedScreen}
        component={isDisabled ? DisabledView : ForumThreadOwnedScreen}
        options={{title: 'Your Forums'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumRecentScreen}
        component={isDisabled ? DisabledView : ForumThreadRecentScreen}
        options={{title: 'Recently Viewed'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumPostSearchScreen}
        component={isDisabled ? DisabledView : ForumPostSearchScreen}
        options={{title: 'Post Search'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumThreadSearchScreen}
        component={isDisabled ? DisabledView : ForumThreadSearchScreen}
        options={{title: 'Forum Search'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumThreadCreateScreen}
        component={isDisabled ? DisabledView : ForumThreadCreateScreen}
        options={{title: 'New Forum'}}
      />
      <Stack.Screen
        name={ForumStackComponents.forumPostAlertwordScreen}
        component={ForumPostAlertwordScreen}
        options={{title: 'Alert Keyword'}}
      />
      {CommonScreens(Stack as typeof MainStack)}
    </Stack.Navigator>
  );
};

export const useForumStackNavigation = () => useNavigation<NativeStackNavigationProp<ForumStackParamList>>();

export const useForumStackRoute = () => useRoute<RouteProp<ForumStackParamList>>();
