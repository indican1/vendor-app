import React, {} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import { COLORS } from '../assets/colors';
import { FONTS } from '../constants';


const CustomButton = (props) => (
    <>
        <TouchableOpacity style={[styles.btn, {backgroundColor: props.disabled ? '#ccc' : props.backgroundColor}]}
            disabled={props.disabled}
            onPress={props.callFunction}
        >
            <Text style={{color: props.titleColor, fontFamily: FONTS.opneSans_SemiBold}}>{props.title}</Text>
        </TouchableOpacity>
    </>
)

export default CustomButton;

const styles = StyleSheet.create({
    btn: {
        width: '80%', height: 35, marginTop: 20, borderRadius: 10, 
        justifyContent: 'center', alignItems: 'center', borderWidth: .5, borderColor: COLORS.themeColor
    }, 
})