import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, View, StyleSheet, TouchableOpacity, Dimensions, Image, Share, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import AppHeader from '../components/header';
import { COLORS } from '../assets/colors';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recentActivity } from '../redux/action/action';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { BASE_URL, FILE_URL, FONTS, GET_PROMOTIONS } from '../constants';
import axios from 'axios';



const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true)
    const [promotionsList, setPromotionsList] = useState([])
   
    const dispatch = useDispatch()

    const { user, recentData } = useSelector(state => ({
        user: state.userReducer.user,
        recentData: state.userReducer.recentArray
    }));

    useEffect(() => {
        // const data = await AsyncStorage.getItem('RECENTDATA');
        // if (data != null || data != undefined) {
        //     let mData = JSON.parse(data)
        //     dispatch(recentActivity(mData))
        // }
        _getPromotions()
    }, [])

    const _getPromotions = () => {
        AsyncStorage.getItem('token').then(token => {
            if (token != null) {
                axios.get(`${BASE_URL}${GET_PROMOTIONS}`, {
                    headers: { Authorization: token }
                }).then(response => {
                    if (response.data.msg === 'success') {
                        setPromotionsList(response.data.promotions)
                        setIsLoading(false)
                    } else {
                        setIsLoading(false)
                    }

                }).catch(error => {
                    setIsLoading(false)
                })
            } else {
                setIsLoading(false)
            }
        });
    }

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='IndiScan' backgroundColor={COLORS.themeColor} icon1='menu' icon2='ios-search' icon3='notifications-outline'
                icon1Color={COLORS.white} profilePic={user.profile} />
            <KeyboardAwareScrollView>
                <View style={styles.greenCard} />
                <View style={styles.whiteCard}>
                    <View style={{
                        borderBottomColor: COLORS.lightGray, borderBottomWidth: 2,
                        height: 70, width: '90%', alignSelf: 'center', justifyContent: 'space-between'
                    }}>
                        <Text style={{ marginTop: 10, color: COLORS.color3, fontFamily: FONTS.openSans_Bold, fontSize: 22 }}>Hello, {user.first_name}</Text>
                        <Text style={[styles.phone_number, { marginTop: 3 }]}>{user.phone_number}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ marginTop: 20, marginLeft: 20, color: COLORS.color2, fontFamily: FONTS.openSans_Regular }}>Current Balance</Text>
                            <Text style={{ marginLeft: 20, marginTop: 5, color: COLORS.color1, fontFamily: FONTS.openSans_Regular, fontSize: 18 }}>{`$${user.wallet.toFixed(2)}`}</Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                            <TouchableOpacity style={styles.siginBtn}
                                onPress={() => {
                                    navigation.navigate('addCash')
                                }}
                            >
                                <Text style={{ color: COLORS.white, alignSelf: 'center', fontSize: 12, fontFamily: FONTS.openSans_Regular }}>{
                                    'Add Cash'
                                }</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Second Card */}
                <View style={[styles.whiteCard, { top: height / 4, flexDirection: 'row', height: height / 12, justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TouchableOpacity style={[styles.trascationCard, { marginLeft: 10 }]}
                        onPress={() => {
                            navigation.navigate('sendCash')
                        }}
                    >
                        <Image style={styles.icon}
                            source={require('../assets/images/sendmoney.png')}
                        />
                        <Text style={styles.tabsTitle}>Send Money</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.trascationCard}
                        onPress={async () => {
                            await Share.share({
                                message: 
                                'https://play.google.com/store/apps/details?id=com.IndiscanLLC.indiscanvendor     https://apps.apple.com/us/app/indiscanvendor/id1591885381'
                            })
                        }}
                    >
                        <Image style={styles.icon}
                            source={require('../assets/images/inviteuser.png')}
                        />
                        <Text style={styles.tabsTitle}>Invite User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.trascationCard}
                        onPress={() => {
                            navigation.navigate('chargeOptions')
                        }}
                    >
                        <Image style={[styles.icon, { tintColor: COLORS.color3 }]}
                            source={require('../assets/images/chargeUser.png')}
                        />
                        <Text style={styles.tabsTitle}>Charge User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.trascationCard, { marginRight: 10 }]}
                        onPress={() => navigation.navigate('transactionHistory')}
                    >
                        <Image style={styles.icon}
                            source={require('../assets/images/trx_history.png')}
                        />
                        <Text style={styles.tabsTitle}>Transaction History</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginTop: height / 4 }}>
                    <Text style={styles.cardsTitle}>Promotions</Text>
                    <KeyboardAwareScrollView
                        contentContainerStyle={{ marginTop: 15 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            promotionsList.map((item, index) => {
                                return (
                                    <>
                                        {
                                            isLoading ?
                                                <View style={{ justifyContent: 'center', alignItems: 'center', width: width }}>
                                                    <ActivityIndicator color={COLORS.themeColor} size='large' />
                                                </View> :
                                                <TouchableOpacity key={item._id} style={[styles.promotionCard, {
                                                    marginLeft: index > 0 ? 10 : 25,
                                                    marginRight: index === promotionsList.length - 1 ? 10 : 0
                                                }]}
                                                    onPress={() => Linking.openURL(item.url)}
                                                >
                                                    <Image style={styles.promotionImg}
                                                        source={{ uri: FILE_URL + item.image }}
                                                    />
                                                </TouchableOpacity>
                                        }
                                    </>
                                )
                            })
                        }

                    </KeyboardAwareScrollView>
                    {/* {
                        recentData.length != 0 && (
                            <>
                                <Text style={[styles.cardsTitle, { marginTop: 20 }]}>Favourites</Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {
                                        recentData.map((item, index) => {
                                            return (
                                                <View style={[styles.favouriteCard, { marginLeft: index > 0 ? 10 : 25, marginRight: index === array.length - 1 ? 10 : 0 }]}>
                                                    <Text>Icon</Text>
                                                    <Text>{item.destinationId.substring(0,10)}</Text>
                                                </View>
                                            )
                                        })
                                    }

                                </ScrollView>
                            </>
                        )
                    } */}
                </View>

            </KeyboardAwareScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },

    greenCard: { width: '100%', height: height / 6, backgroundColor: COLORS.themeColor },

    whiteCard: {
        width: '90%', height: height / 4.5, backgroundColor: COLORS.white, alignSelf: 'center', borderRadius: 10, marginTop: 40,
        shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 10,
        position: 'absolute',
    },

    siginBtn: {
        width: 80, height: 22, borderRadius: 5, backgroundColor: COLORS.themeColor,
        justifyContent: 'center', alignSelf: 'flex-end', marginRight: 20
    },

    phone_number: { marginTop: 15, color: COLORS.color4, fontFamily: FONTS.openSans_Regular, fontSize: 15 },

    trascationCard: { width: 70, height: '100%', justifyContent: 'space-evenly', alignItems: 'center' },

    icon: { width: 30, height: 30, resizeMode: 'contain' },

    tabsTitle: { fontSize: 11, textAlign: 'center', color: COLORS.color3, fontFamily: FONTS.openSans_Regular },

    promotionCard: {
        width: 320, height: 170, backgroundColor: COLORS.white, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
        shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.23,
        shadowRadius: 2.62, elevation: 10, marginTop: 10, flexDirection: 'row', bottom: 5
    },

    promotionImg: { width: 320, height: 170, borderRadius: 10, },

    cardsTitle: { marginLeft: 30, fontWeight: 'bold', color: COLORS.color1, fontFamily: FONTS.openSans_Bold, fontSize: 18 },

    favouriteCard: {
        width: 100, height: 100, backgroundColor: COLORS.white, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
        shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 10, marginTop: 10, bottom: 5
    },
})

export default Home;