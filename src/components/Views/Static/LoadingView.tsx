import React from 'react';
import {ScrollView, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {AppView} from '../AppView';
import {ScrollingContentView} from '../Content/ScrollingContentView';

export const LoadingView = () => {
  return (
    <View>
      <ScrollingContentView>
        <ScrollView>
          <ActivityIndicator />
          <Text>Loading...</Text>
        </ScrollView>
      </ScrollingContentView>
    </View>
  );
};
