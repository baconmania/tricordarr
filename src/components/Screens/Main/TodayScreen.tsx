import React, {useCallback, useEffect, useState} from 'react';
import {AppView} from '../../Views/AppView';
import {ScrollingContentView} from '../../Views/Content/ScrollingContentView';
import {PaddedContentView} from '../../Views/Content/PaddedContentView';
import {MainStackComponents, MainStackParamList} from '../../Navigation/Stacks/MainStackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDrawer} from '../../Context/Contexts/DrawerContext';
import {TodayAnnouncementView} from '../../Views/Today/TodayAnnouncementView.tsx';
import {RefreshControl, View} from 'react-native';
import {useDailyThemeQuery} from '../../Queries/Alert/DailyThemeQueries.ts';
import {useAnnouncementsQuery} from '../../Queries/Alert/AnnouncementQueries.ts';
import {useUserFavoritesQuery} from '../../Queries/Users/UserFavoriteQueries.ts';
import {useUserMutesQuery} from '../../Queries/Users/UserMuteQueries.ts';
import {useUserBlocksQuery} from '../../Queries/Users/UserBlockQueries.ts';
import {useUserNotificationDataQuery} from '../../Queries/Alert/NotificationQueries';
import {useAuth} from '../../Context/Contexts/AuthContext';
import {ModeratorCard} from '../../Cards/MainScreen/ModeratorCard';
import {usePrivilege} from '../../Context/Contexts/PrivilegeContext';
import {TodayThemeView} from '../../Views/Today/TodayThemeView.tsx';
import {TodayNextAppointmentView} from '../../Views/Today/TodayNextAppointmentView.tsx';
import {MainAccountMenu} from '../../Menus/MainAccountMenu';
import {TodayHeaderView} from '../../Views/Today/TodayHeaderView.tsx';
import {TodayHeaderTitle} from '../../Navigation/Components/TodayHeaderTitle';
import {TodayTimezoneWarningView} from '../../Views/Today/TodayTimezoneWarningView.tsx';
import {TodayAppUpdateView} from '../../Views/TodayAppUpdateView.tsx';
import {useClientConfigQuery} from '../../Queries/Client/ClientQueries.ts';
import {NotificationsMenu} from '../../Menus/NotificationsMenu.tsx';
import {MaterialHeaderButton} from '../../Buttons/MaterialHeaderButton.tsx';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {useUserProfileQuery} from '../../Queries/User/UserQueries.ts';

type Props = NativeStackScreenProps<MainStackParamList, MainStackComponents.mainScreen>;

export const TodayScreen = ({navigation}: Props) => {
  const {getLeftMainHeaderButtons} = useDrawer();
  // These queries are disabled to prevent bombarding the server on app launch. Some will fire anyway such as themes or
  // announcements but typically have a higher than usual stale time.
  // The rest are here for pull-to-refetch.
  // The exception is UserNotificationData because that needs to more aggressively re-fire. But because I put it in
  // state rather than reference the query it rarely organically refetches.
  const {refetch: refetchThemes} = useDailyThemeQuery({enabled: false});
  const {refetch: refetchAnnouncements} = useAnnouncementsQuery({enabled: false});
  const {refetch: refetchFavorites} = useUserFavoritesQuery({enabled: false});
  const {refetch: refetchMutes} = useUserMutesQuery({enabled: false});
  const {refetch: refetchBlocks} = useUserBlocksQuery({enabled: false});
  const {refetch: refetchUserNotificationData} = useUserNotificationDataQuery({enabled: false});
  const {refetch: refetchClient} = useClientConfigQuery({enabled: false});
  const {refetch: refetchProfile} = useUserProfileQuery({enabled: false});
  const {isLoggedIn} = useAuth();
  const {hasModerator} = usePrivilege();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchUserNotificationData(), refetchThemes(), refetchAnnouncements(), refetchClient()]);
    if (isLoggedIn) {
      await Promise.all([refetchProfile(), refetchFavorites(), refetchBlocks(), refetchMutes()]);
    }
    setRefreshing(false);
  };

  const getRightMainHeaderButtons = useCallback(() => {
    return (
      <View>
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          {isLoggedIn && <NotificationsMenu />}
          <MainAccountMenu />
        </HeaderButtons>
      </View>
    );
  }, [isLoggedIn]);

  const getTitle = useCallback(() => <TodayHeaderTitle />, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: getLeftMainHeaderButtons,
      headerRight: getRightMainHeaderButtons,
      headerTitle: getTitle,
    });
  }, [getLeftMainHeaderButtons, getRightMainHeaderButtons, getTitle, navigation]);

  return (
    <AppView>
      <ScrollingContentView
        isStack={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <TodayHeaderView />
        <TodayTimezoneWarningView />
        <TodayAnnouncementView />
        <TodayThemeView />
        <TodayNextAppointmentView />
        {hasModerator && (
          <PaddedContentView padBottom={false}>
            <ModeratorCard />
          </PaddedContentView>
        )}
        <TodayAppUpdateView />
      </ScrollingContentView>
    </AppView>
  );
};
