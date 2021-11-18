
import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, StatusBar, SafeAreaView, Image } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/colors';
import { FILE_URL, FONTS, IMAGES } from '../constants';

Icon.loadFont()
const AppHeader = ({ navigation, ...props }) => (
    <SafeAreaView style={[styles.statusBar, { backgroundColor: props.backgroundColor }]}>
        <StatusBar backgroundColor={props.backgroundColor} />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => {
                    props.title === 'IndiScan' ? navigation.openDrawer() : navigation.goBack()
                }}
            >
                <Icon name={props.icon1} size={props.title === 'IndiScan' ? 30 : 24} style={{ marginLeft: 10 }} color={props.icon1Color} />
            </TouchableOpacity>
            {
                props.title === 'IndiScan' ?
                <Image style={{width: 120, height: 30, resizeMode: 'contain'}}
                    source={IMAGES.logo}
                /> :
                <Text style={[styles.title]}>{props.title}</Text>
            }
            {props.title === 'IndiScan' ?
                <Avatar.Image size={30} source={{ uri: `${FILE_URL}${props.profilePic}` }} style={{ marginRight: 10 }} /> :
                <View style={{ marginRight: 10, width: 30 }} />
            }
        </View>
    </SafeAreaView>
);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 80 : 50;
const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
        flexDirection: 'row'
    },
    title: {
        alignSelf: 'center',
        textAlign: 'center',
        color: COLORS.white,
        fontFamily: FONTS.opneSans_SemiBold,
        fontSize: 18
    },
    icon: { marginRight: 10, marginBottom: 10 }
});

export default AppHeader;