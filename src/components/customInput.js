import React from 'react';
import { Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';

Icon.loadFont()

{/* For textinput change the min height inside the paper library (src/components/textinput/textinputoutlined.tsx)
i have set min height = 50 by default it was 64 */}

const CustomInput = (props) => (
  <>
    <TextInput style={{ width: '80%', height: Platform.OS === 'ios' ? 40 : '',
     marginTop: props.marginTop, backgroundColor: COLORS.white}}
      label={props.hint}
      selectionColor={COLORS.themeColor}
      mode='outlined'
      value={props.value}
      autoCapitalize={props.keyboardType === 'email-address' ? 'none' : 'words'}
      keyboardType={props.keyboardType}
      maxLength={props.maxLength}
      secureTextEntry={props.secureTextEntry}
      theme={{ roundness: 8, colors: { primary: COLORS.inputBorder, accent: 'red' } }}
      left={<TextInput.Icon name={() => <Icon style={{ marginTop: 7 }} name={props.icon} size={20} />} />}
      onChangeText={(value) => {
        props.onChange(value);
    }}
    />
  </>
)

export default CustomInput;