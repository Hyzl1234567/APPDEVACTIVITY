import React from 'react';
import { Image, Text, View } from 'react-native';
import { IMG } from '../utils';

const ErrorScreen: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'blue',
        borderWidth: 3,
      }}
    >
      <Image
        source={{
          uri: IMG.LOGO,
        }}
        style={{
          width: 200,
          height: 200,
        }}
      />
      <Text>ErrorScreen</Text>
    </View>
  );
};

export default ErrorScreen;
