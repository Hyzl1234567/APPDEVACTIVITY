import React from 'react';
import { Dimensions, Text, View, TextStyle, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface CustomTextInputProps {
  placeholder: string;
  label: string;
  labelStyle?: TextStyle;
  value: string | ((text: string) => void);
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  label,
  labelStyle,
  value,
  containerStyle,
  textStyle,
}) => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        onChangeText={value as (text: string) => void}
        style={[
          textStyle,
          {
            width: width * 0.9,
            borderBottomWidth: 1,
          },
        ]}
      />
    </View>
  );
};

export default CustomTextInput;
