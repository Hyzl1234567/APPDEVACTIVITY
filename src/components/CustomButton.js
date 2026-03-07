import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CustomButton = ({
  containerStyle,
  label,
  textStyle,
  onPress,
  loading,
}) => {
  const { width, height } = Dimensions.get('window');

  return (
    <>
      {loading ? (
        <View className="h-20 p-4">
          <ActivityIndicator size={'large'} color={'blue'} />
        </View>
      ) : (
        <View style={containerStyle}>
          <TouchableOpacity onPress={onPress}>
            <View style={{ padding: width * 0.014 }}>
              <Text style={textStyle}>{label}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default CustomButton;
