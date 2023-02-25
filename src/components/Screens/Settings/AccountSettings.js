import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {LoginView} from '../../Views/Auth/LoginView';
import {LogoutView} from '../../Views/Auth/LogoutView';
import {AppView} from '../../Views/AppView';
import {useUserData} from '../../Contexts/UserDataContext';

export const AccountSettings = ({route, navigation}) => {
  const {isLoggedIn} = useUserData();

  useEffect(() => {
    navigation.setOptions({title: route.params.title});
  }, [navigation, route.params.title]);

  return (
    <AppView>
      <ScrollView>
        {isLoggedIn && <LogoutView />}
        {!isLoggedIn && <LoginView />}
      </ScrollView>
    </AppView>
  );
};
