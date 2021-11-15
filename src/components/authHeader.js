
import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, StatusBar, Image, Dimensions } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/colors';
import { FONTS } from '../constants';

Icon.loadFont()
const screen = Dimensions.get('window');

const AuthHeader = ({ navigation, ...props }) => (

    <View style={[styles.statusBar, { backgroundColor: props.backgroundColor }]}>
        <StatusBar backgroundColor={props.backgroundColor} />
        <View style={{ flex: .7, alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row' }}>
            {
                props.step != 1 ?
                    <TouchableOpacity style={{ marginLeft: 20 }}
                        onPress={() => props.callFunction()}
                    >
                        <Icon name='ios-arrow-back' size={30} color={COLORS.color1}/>
                    </TouchableOpacity> : <View />
            }

            <TouchableOpacity style={{ marginRight: 20 }}
                onPress={() => navigation.goBack()}
            >
                <Text style={{ marginRight: 15, color: COLORS.color1, fontFamily: FONTS.opneSans_SemiBold }}>Skip</Text>
            </TouchableOpacity>
        </View>
        {/* <Image
            style={{ width: screen.width - 50, height: screen.height / 5, marginTop: 20, resizeMode: 'contain' }}
            source={props.introPic}
        /> */}
    </View>
);

// const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 290 : 290;
const STATUSBAR_HEIGHT = 130;
const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
});

export default AuthHeader;