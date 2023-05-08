import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {ScrollingContentView} from '../../Views/Content/ScrollingContentView';
import {AppView} from '../../Views/AppView';
import {useUserData} from '../../Context/Contexts/UserDataContext';
import {SeamailListItem} from '../../Lists/Items/SeamailListItem';
import {SeamailSearchBar} from '../../Search/SeamailSearchBar';
import {SeamailAccountButtons} from '../../Buttons/SeamailAccountButtons';
import {NotLoggedInView} from '../../Views/Static/NotLoggedInView';
import {LoadingView} from '../../Views/Static/LoadingView';
import {PaddedContentView} from '../../Views/Content/PaddedContentView';
import {SeamailNewFAB} from '../../Buttons/FloatingActionButtons/SeamailNewFAB';
import {ListSection} from '../../Lists/ListSection';
import {useSeamailListQuery} from '../../Queries/Fez/FezQueries';
import {usePrivilege} from '../../Context/Contexts/PrivilegeContext';
import {useTwitarr} from '../../Context/Contexts/TwitarrContext';
// import {useSocket} from '../../Context/Contexts/SocketContext';
// import {NotificationTypeData, SocketNotificationData} from '../../../libraries/Structs/SocketStructs';

export const SeamailListScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {isLoggedIn, isLoading, isPrivileged} = useUserData();
  const {asPrivilegedUser} = usePrivilege();
  const {data, refetch} = useSeamailListQuery(asPrivilegedUser);
  const {fezList, setFezList, incrementFezPostCount, unshiftFez} = useTwitarr();
  // const {notificationSocket} = useSocket();

  console.log('SeamailListScreen::Render::Start');

  useEffect(() => {
    setFezList(data);
    // return () => setFezList(undefined);
  }, [data, setFezList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // const notificationHandler = useCallback(
  //   (event: WebSocketMessageEvent) => {
  //     const socketMessage = JSON.parse(event.data) as SocketNotificationData;
  //     console.log('SeamailListScreen received', socketMessage);
  //     if (SocketNotificationData.getType(socketMessage) === NotificationTypeData.seamailUnreadMsg) {
  //       if (fezList?.fezzes.some(f => f.fezID === socketMessage.contentID)) {
  //         incrementFezPostCount(socketMessage.contentID);
  //         unshiftFez(socketMessage.contentID);
  //       } else {
  //         // This is kinda a lazy way out, but it works.
  //         // Not using onRefresh() so that we don't show the sudden refreshing circle.
  //         // Hopefully that's a decent idea.
  //         refetch();
  //       }
  //     }
  //   },
  //   [incrementFezPostCount, unshiftFez],
  // );

  // useEffect(() => {
  //   console.log('*** SeamailListScreen useEffect');
  //   if (notificationSocket) {
  //     console.log('[NotificationSocket] adding notificationHandler for SeamailListScreen');
  //     notificationSocket.addEventListener('message', notificationHandler);
  //   }
  //   return () => {
  //     console.log('*** SeamailListScreen useEffect Return?!?!?!?!');
  //     if (notificationSocket) {
  //       console.log('[NotificationSocket] removing notificationHandler for SeamailListScreen');
  //       notificationSocket.removeEventListener('message', notificationHandler);
  //     }
  //   };
  // }, [notificationHandler, notificationSocket]);

  if (!isLoggedIn) {
    return <NotLoggedInView />;
  }

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <AppView>
      <ScrollingContentView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          <PaddedContentView>
            <SeamailSearchBar />
          </PaddedContentView>
          {isPrivileged && (
            <PaddedContentView>
              <SeamailAccountButtons />
            </PaddedContentView>
          )}
          <ListSection>
            <Divider bold={true} />
            {fezList &&
              fezList.fezzes.map(fez => (
                <View key={fez.fezID}>
                  <SeamailListItem fez={fez} />
                  <Divider bold={true} />
                </View>
              ))}
          </ListSection>
        </View>
      </ScrollingContentView>
      <SeamailNewFAB />
    </AppView>
  );
};
