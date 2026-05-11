import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { IMG } from '../utils';
import { useDispatch } from 'react-redux';
import { resetLogin } from '../app/actions';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import CustomButton from '../components/CustomButton';

interface NavigationProps {
  navigate: (screen: string) => void;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const logAnalytics = async () => {
      try {
        const analyticsInstance = getAnalytics();
        await logEvent(analyticsInstance, 'app_open');
        console.log('Analytics event logged!');
      } catch (error) {
        console.log('Analytics error:', error);
      }
    };
    logAnalytics();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await GoogleSignin.signOut();
      dispatch(resetLogin());
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
        }}
        style={{
          width: 200,
          height: 200,
        }}
      />
      <Text>HomeScreen</Text>

      <CustomButton
        label="LOGOUT"
        backgroundColor="green"
        onPress={handleLogout}
        loading={isLoggingOut}
        disabled={isLoggingOut}
      />
    </View>
  );
};

export default HomeScreen;