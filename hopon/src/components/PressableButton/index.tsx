import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import styles from './styles';

type MyButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  text: string;
};

const PressableButton = ({ onPress, disabled = false, text }: MyButtonProps) => {
  const buttonStyle: ViewStyle = disabled ? styles.disabledButton : styles.button;
  const textStyle = disabled ? styles.disabledText : styles.textButton;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={buttonStyle}>
      <Text style={textStyle}>{text}</Text>
    </Pressable>
  );
}

export default PressableButton;