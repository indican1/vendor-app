import React, { } from 'react';
import { View, Text, Dimensions, StyleSheet, Alert, Share, Platform, Linking } from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import { Avatar, Drawer } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { FILE_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/action/action';

const { width, height } = Dimensions.get('window')

const SideMenu = (props) => {


    const { user } = useSelector(state => ({
        user: state.userReducer.user
    }));

    const dispatch = useDispatch()

    const logOut = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        clearStorage()
                    }
                }
            ]
        );
    }

    const clearStorage = async () => {
        let obj = {
            _id: ''
        }
        dispatch(setUser(obj))
        props.navigation.closeDrawer()
        await AsyncStorage.removeItem('token')
    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} >
                <View style={{ flex: 1 }}>
                    <View style={{ paddingLeft: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Avatar.Image size={60} source={{ uri: `${FILE_URL}${user.profile}` }} style={{ margin: 10 }} />
                            <Text style={{ marginTop: 20, marginLeft: 10, fontWeight: 'bold' }}>{user.first_name}</Text>
                        </View>
                        <Text>{user.phone_number}</Text>
                    </View>

                    <Drawer.Section style={{ marginTop: 40 }}>
                        <DrawerItem
                            onPress={() => {
                                props.navigation.closeDrawer()
                            }}
                            label={
                                user._id != '' ? 'Account Status  '+ 
                                user.account_status.charAt(0).toUpperCase()+user.account_status.slice(1)  : ''
                            }
                        />
                    </Drawer.Section>

                    <Drawer.Section style={{ marginTop: 10 }}>
                        <DrawerItem
                            onPress={() => {
                                props.navigation.navigate('forgotPin',{
                                    screen: 'drawer'
                                })
                            }}
                            label='Change Pin'
                        />
                    </Drawer.Section>

                    <Drawer.Section style={{ marginTop: 10 }}>
                    <DrawerItem
                            onPress={() => {
                                Linking.openURL('http://indiscan.com/contact-us/')
                                props.navigation.closeDrawer()
                            }}
                            label='Customer Support'
                        />
                    </Drawer.Section>

                    <Drawer.Section style={{ marginTop: 10 }}>
                        <DrawerItem
                            onPress={() => {
                                props.navigation.navigate('verifyUser')
                            }}
                            label='Verify User'
                        />
                    </Drawer.Section>

                    <Drawer.Section style={{ marginTop: 10 }}>
                        <DrawerItem
                            onPress={ async () => {
                                await Share.share({
                                    message: 
                                    'https://play.google.com/store/apps/details?id=com.IndiscanLLC.indiscanvendor     https://apps.apple.com/us/app/indiscanvendor/id1591885381' 
                                })
                                props.navigation.closeDrawer()
                            }}
                            label='Invite User'
                        />
                    </Drawer.Section>
                    <Drawer.Section style={{ marginTop: 10 }}>
                        <DrawerItem
                            onPress={() => {
                               props.navigation.navigate('locateVendors')
                                props.navigation.closeDrawer()
                            }}
                            label='Locate Vendors'
                        />
                    </Drawer.Section>
                </View>


            </DrawerContentScrollView>
            <Drawer.Section style={styles.logout}>
                <DrawerItem
                    onPress={() => {
                        logOut()
                    }}
                    label='Logout'
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    logout: {
        marginBottom: 15
    }
})

export default SideMenu;