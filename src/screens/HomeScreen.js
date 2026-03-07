import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { IMG, ROUTES } from '../utils';

import { useDispatch } from 'react-redux';
import { resetLogin } from '../app/reducers/auth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={{
          uri: IMG.LOGO,
          // uri: 'https://www.chachinggroup.com/blog/wp-content/uploads/2016/07/logo-design-in-Thailand.jpg',
        }}
        style={{
          width: 200,
          height: 200,
        }}
      />
      <Text>HomeScreen</Text>

      <TouchableOpacity
        onPress={() => {
          dispatch(resetLogin());
        }}
      >
        <View
          style={{
            padding: 20,
            backgroundColor: 'green',
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 40, color: 'white' }}>LOGOUT</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
