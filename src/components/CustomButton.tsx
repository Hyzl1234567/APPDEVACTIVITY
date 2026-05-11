import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';

interface CustomButtonProps {
  containerStyle?: ViewStyle;
  label: string;
  textStyle?: TextStyle;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  containerStyle,
  label,
  textStyle,
  onPress,
  loading = false,
  disabled = false,
  backgroundColor = 'blue',
}) => {
  const { width } = Dimensions.get('window');

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={backgroundColor} />
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
          style={[
            styles.button,
            { backgroundColor },
            disabled && styles.disabled,
          ]}
        >
          <Text style={[styles.label, textStyle]}>{label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  loadingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;