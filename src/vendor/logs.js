import React, { useEffect, useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, Platform,
    TouchableOpacity, Modal, KeyboardAvoidingView, Image, ActivityIndicator
} from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, FONTS, IMAGES, LOADER_DATA, VERIFICATION_LOGS } from '../constants';
import CustomLoader from '../components/customLoader';
import moment from 'moment';
import { recentActivity } from '../redux/action/action';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
Icon.loadFont();

const ActivityLogs = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true)
    const [logsHistory, setLogsHistory] = useState([])

    const { user, recentData } = useSelector(state => ({
        user: state.userReducer.user,
        recentData: state.userReducer.recentArray
    }))

    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        await axios.get(`${BASE_URL}${VERIFICATION_LOGS}`, {
            headers: { Authorization: token }
        }).then(async (response) => {
            const sortArray = await response.data.logs.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            setLogsHistory(sortArray)
            console.log("RESPONSE::::", response)
            
            setIsLoading(false)
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
        })
    }, [])

    const EmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>No Logs History Found</Text>
        </View>
    )

    if (isLoading) {
        return (
            <View style={{ flex: 1, marginTop: 50 }}>
                <CustomLoader data={LOADER_DATA} />
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Activity Logs' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <FlatList
                contentInset={{ right: 0, top: 0, left: 0, bottom: 30 }}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 70 : 0 }}
                data={logsHistory}
                extraData={logsHistory}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) =>
                    <View style={{
                        width: '95%', alignSelf: 'center', marginTop: index === 0 ? 30 : 0,
                        shadowOffset: { width: 0, height: 20 }, shadowRadius: 2, shadowOpacity: .9, shadowColor: COLORS.lightGray,
                        borderColor: COLORS.lightGray, borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: index === 0 ? 2 : 0,
                        borderTopLeftRadius: index === 0 ? 10 : 0, borderTopRightRadius: index === 0 ? 10 : 0, elevation: 10,
                        borderBottomWidth: index === logsHistory.length - 1 ? 2 : 0, borderBottomLeftRadius:
                            index === logsHistory.length - 1 ? 10 : 0, borderBottomRightRadius:
                            index === logsHistory.length - 1 ? 10 : 0
                    }}>
                        <View style={styles.flatListContainer}>
                            <View style={{
                                width: '90%', height: '90%', justifyContent: 'space-between',
                                alignItems: 'center', flexDirection: 'row', borderBottomColor: COLORS.color2, borderBottomWidth: index === logsHistory.length - 1 ? 0 : .2
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 17, fontFamily: FONTS.opneSans_SemiBold, color: COLORS.color3 }}>{item.customer_name}</Text>
                                    <Text style={styles.date}>{moment(item.createdAt).format('DD/MM/Y')}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={{ color: item.trx_type === 'credit' ? COLORS.green : COLORS.red, fontFamily: FONTS.opneSans_SemiBold }}>{item.customer_phone}</Text>
                                    <Text style={styles.date}>{moment(item.createdAt).format('hh:mm A')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }

                ListEmptyComponent={EmptyComponent}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    balanceCard: {
        width: '95%', height: 120, backgroundColor: COLORS.white, borderColor: COLORS.lightGray, borderWidth: 1,
        alignSelf: 'center', borderRadius: 10, shadowOffset: { width: 0, height: 1 },
        shadowColor: COLORS.lightGray, shadowOpacity: .9, elevation: 10, shadowRadius: 2, marginTop: 20
    },
    walletTitle: {
        color: COLORS.color2, marginTop: 20, fontSize: 12, fontWeight: 'bold', marginLeft: 15, fontFamily: FONTS.openSans_Regular
    },
    amount: {
        color: COLORS.color1, marginTop: 10, marginLeft: 20, fontSize: 20, fontFamily: FONTS.openSans_Regular
    },
    flatListContainer: {
        width: '95%', height: 90, alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
    },
    emptyContainer: {
        height: height / 1.5, alignItems: 'center', justifyContent: 'center',
    },
    date: {
        color: COLORS.color1, fontSize: 12, marginTop: 5, fontFamily: FONTS.openSans_Regular
    },
    modalView: {
        width: width, height: height - 50, borderTopColor: '#ccc',
        backgroundColor: COLORS.white, alignSelf: 'center',
    },
    historyTitle: {
        marginTop: 20, fontFamily: 'OpenSans-Bold'
    }
})

export default ActivityLogs;