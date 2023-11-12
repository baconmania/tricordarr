import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppView} from '../../Views/AppView';
import {RefreshControl, StyleSheet, View} from 'react-native';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {FlatList} from 'react-native-gesture-handler';
import {MaterialHeaderButton} from '../../Buttons/MaterialHeaderButton';
import {AppIcons} from '../../../libraries/Enums/Icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigatorIDs, ScheduleStackComponents} from '../../../libraries/Enums/Navigation';
import {ScheduleStackParamList} from '../../Navigation/Stacks/ScheduleStackNavigator';
import {ScheduleCruiseDayMenu} from '../../Menus/ScheduleCruiseDayMenu';
import {useEventsQuery} from '../../Queries/Events/EventQueries';
import {EventFlatList} from '../../Lists/Schedule/EventFlatList';
import {useCruise} from '../../Context/Contexts/CruiseContext';
import {IconButton, Text} from 'react-native-paper';
import {format, parseISO} from 'date-fns';
import {useStyles} from '../../Context/Contexts/StyleContext';
import {LoadingView} from '../../Views/Static/LoadingView';
import {useLfgListQuery} from '../../Queries/Fez/FezQueries';
import {EventData, FezData} from '../../../libraries/Structs/ControllerStructs';
import {ScheduleFAB} from '../../Buttons/FloatingActionButtons/ScheduleFAB';
import {ScheduleFilterSettings} from '../../../libraries/Types';
import {EventType} from '../../../libraries/Enums/EventType';
import useDateTime, {calcCruiseDayTime, getTimeZoneOffset} from '../../../libraries/DateTime';
import {ScheduleEventFilterMenu} from '../../Menus/ScheduleEventFilterMenu';
import {useScheduleFilter} from '../../Context/Contexts/ScheduleFilterContext';
import {useConfig} from '../../Context/Contexts/ConfigContext';
import {ScheduleMenu} from '../../Menus/ScheduleMenu';
import {useTwitarr} from '../../Context/Contexts/TwitarrContext';
import {EventListActions} from '../../Reducers/Event/EventListReducer';

export type Props = NativeStackScreenProps<
  ScheduleStackParamList,
  ScheduleStackComponents.scheduleDayScreen,
  NavigatorIDs.scheduleStack
>;

export const ScheduleDayScreen = ({navigation, route}: Props) => {
  const {eventTypeFilter, eventFavoriteFilter} = useScheduleFilter();
  const {
    data: eventData,
    isLoading: isEventLoading,
    refetch: refetchEvents,
  } = useEventsQuery({cruiseDay: route.params.cruiseDay});
  const {
    data: lfgData,
    isLoading: isLfgLoading,
    refetch: refetchLfgs,
  } = useLfgListQuery({cruiseDay: route.params.cruiseDay - 1});
  const {commonStyles} = useStyles();
  const {cruiseDays, cruiseDayToday, cruiseLength, startDate, endDate} = useCruise();
  const listRef = useRef<FlatList<EventData | FezData>>(null);
  // const [scheduleItems, setScheduleItems] = useState<(EventData | FezData)[]>([]);
  const [scrollNowIndex, setScrollNowIndex] = useState(0);
  // const minutelyUpdatingDate = useDateTime('minute');
  const [refreshing, setRefreshing] = useState(false);
  const {appConfig} = useConfig();
  const {eventList, dispatchEventList} = useTwitarr();

  // const buildListData = useCallback(
  //   (filterSettings: ScheduleFilterSettings) => {
  //     console.log('### Building Schedule Item List');
  //     let itemList: (EventData | FezData)[] = [];
  //
  //     if (filterSettings.showLfgs) {
  //       lfgData?.pages.map(page => {
  //         // The API already filters out cancelled LFGs so we don't need to process those here too.
  //         // lfgList = lfgList.concat(page.fezzes);
  //         page.fezzes.map(fez => {
  //           itemList.push(fez);
  //         });
  //       });
  //     }
  //
  //     eventList.map(event => {
  //       if (
  //         (filterSettings.eventTypeFilter && event.eventType !== EventType[filterSettings.eventTypeFilter]) ||
  //         (filterSettings.eventFavoriteFilter && !event.isFavorite)
  //       ) {
  //         return;
  //       } else {
  //         itemList.push(event);
  //       }
  //     });
  //
  //     // ChatGPT for the win
  //     itemList.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  //
  //     const nowDayTime = calcCruiseDayTime(minutelyUpdatingDate, startDate, endDate);
  //     for (let i = 0; i < itemList.length; i++) {
  //       const itemStartDayTime = calcCruiseDayTime(parseISO(itemList[i].startTime), startDate, endDate);
  //       const tzOffset = getTimeZoneOffset(appConfig.portTimeZoneID, itemList[i].timeZone, itemList[i].startTime);
  //
  //       if (
  //         nowDayTime.cruiseDay === itemStartDayTime.cruiseDay &&
  //         nowDayTime.dayMinutes - tzOffset <= itemStartDayTime.dayMinutes
  //       ) {
  //         setScrollNowIndex(i - 1);
  //         break;
  //       }
  //     }
  //     // If we have ScheduleItems but Now is beyond the last one of the day, simply set the index to the last possible item.
  //     if (itemList.length > 0) {
  //       const lastItemStartDayTime = calcCruiseDayTime(
  //         parseISO(itemList[itemList.length - 1].startTime),
  //         startDate,
  //         endDate,
  //       );
  //       const lastItemTzOffset = getTimeZoneOffset(
  //         appConfig.portTimeZoneID,
  //         itemList[itemList.length - 1].timeZone,
  //         itemList[itemList.length - 1].startTime,
  //       );
  //       if (
  //         nowDayTime.cruiseDay === lastItemStartDayTime.cruiseDay &&
  //         nowDayTime.dayMinutes - lastItemTzOffset >= lastItemStartDayTime.dayMinutes
  //       ) {
  //         setScrollNowIndex(itemList.length - 1);
  //       }
  //     }
  //
  //     // Return the array of parsed ScheduleItems.
  //     return itemList;
  //   },
  //   [appConfig.portTimeZoneID, endDate, eventList, lfgData?.pages, minutelyUpdatingDate, startDate],
  // );

  // const scrollToNow = useCallback(() => {
  //   if (scheduleItems.length === 0 || !listRef.current) {
  //     console.warn('ListRef is undefined or no items, not scrolling.');
  //     return;
  //   }
  //   console.log(
  //     'Scrolling to index',
  //     scrollNowIndex,
  //     'length',
  //     scheduleItems.length,
  //     scheduleItems[scrollNowIndex]?.title,
  //     'at',
  //     scheduleItems[scrollNowIndex]?.startTime,
  //   );
  //   if (scrollNowIndex === 0) {
  //     listRef.current.scrollToOffset({offset: 0});
  //   } else if (scrollNowIndex === scheduleItems.length - 1) {
  //     listRef.current.scrollToEnd();
  //   } else {
  //     listRef.current.scrollToIndex({
  //       index: scrollNowIndex,
  //     });
  //   }
  // }, [scheduleItems, scrollNowIndex]);

  // const getNavButtons = useCallback(() => {
  //   return (
  //     <View>
  //       <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
  //         <ScheduleCruiseDayMenu scrollToNow={scrollToNow} route={route} />
  //         <ScheduleEventFilterMenu />
  //         <ScheduleMenu />
  //       </HeaderButtons>
  //     </View>
  //   );
  // }, [route, scrollToNow]);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: getNavButtons,
  //   });
  // }, [getNavButtons, navigation]);

  // useEffect(() => {
  //   const filterSettings: ScheduleFilterSettings = {
  //     eventTypeFilter: eventTypeFilter ? (eventTypeFilter as keyof typeof EventType) : undefined,
  //     eventFavoriteFilter: eventFavoriteFilter,
  //     showLfgs: appConfig.unifiedSchedule,
  //   };
  //   if (eventData) {
  //     dispatchEventList({
  //       type: EventListActions.setList,
  //       eventList: eventData,
  //     });
  //   }
  //   console.log('Schedule Filter', filterSettings);
  //   // setScheduleItems(buildListData(filterSettings));
  // }, [appConfig.unifiedSchedule, buildListData, dispatchEventList, eventData, eventFavoriteFilter, eventTypeFilter]);

  useEffect(() => {
    if (eventData) {
      dispatchEventList({
        type: EventListActions.setList,
        eventList: eventData,
      });
    }
  }, [dispatchEventList, eventData]);

  const styles = StyleSheet.create({
    headerText: {
      ...commonStyles.paddingHorizontalSmall,
      ...commonStyles.bold,
    },
    headerTextContainer: {
      ...commonStyles.flexGrow,
      ...commonStyles.justifyCenter,
    },
    headerView: {
      ...commonStyles.flexRow,
    },
  });

  const onRefresh = () => {
    setRefreshing(true);
    refetchEvents().then(() => {
      refetchLfgs().then(() => {
        setRefreshing(false);
      });
    });
  };

  const navigatePreviousDay = () =>
    navigation.push(ScheduleStackComponents.scheduleDayScreen, {
      cruiseDay: route.params.cruiseDay - 1,
    });
  const navigateNextDay = () =>
    navigation.push(ScheduleStackComponents.scheduleDayScreen, {
      cruiseDay: route.params.cruiseDay + 1,
    });

  // console.log('Item count', scheduleItems.length, 'Now index', scrollNowIndex);
  console.log('Item count', eventList.length, 'Now index', scrollNowIndex);

  if (isLfgLoading || isEventLoading) {
    return <LoadingView />;
  }

  return (
    <AppView>
      <View style={commonStyles.flex}>
        <View style={{...styles.headerView}}>
          <IconButton icon={AppIcons.back} onPress={navigatePreviousDay} disabled={route.params.cruiseDay === 1} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              {format(cruiseDays[route.params.cruiseDay - 1].date, 'eeee LLLL do')}
              {cruiseDayToday === route.params.cruiseDay ? ' (Today)' : ''}
            </Text>
          </View>
          <IconButton
            icon={AppIcons.forward}
            onPress={navigateNextDay}
            disabled={route.params.cruiseDay === cruiseLength}
          />
        </View>
        <View style={commonStyles.flex}>
          <EventFlatList
            listRef={listRef}
            scheduleItems={eventList}
            scrollNowIndex={scrollNowIndex}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </View>
      </View>
      <ScheduleFAB />
    </AppView>
  );
};
