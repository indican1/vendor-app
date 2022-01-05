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
import { BASE_URL, FONTS, IMAGES, LOADER_DATA, USER_TRANSACTION_HISTORY } from '../constants';
import CustomLoader from '../components/customLoader';
import moment from 'moment';
import { recentActivity } from '../redux/action/action';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
Icon.loadFont();

const TransactionHistory = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true)
    const [isHistoryDtl, setHistoryDtl] = useState(false)
    const [transactionArray, setTransactionArray] = useState([])
    const [userInfo, setUserInfo] = useState('')

    const dispatch = useDispatch()

    const { user, recentData } = useSelector(state => ({
        user: state.userReducer.user,
        recentData: state.userReducer.recentArray
    }))

    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        await axios.get(`${BASE_URL}${USER_TRANSACTION_HISTORY}`, {
            headers: { Authorization: token }
        }).then(async (response) => {
            console.log("USer::", response)
            const sortArray = await response.data.transactions.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            setTransactionArray(sortArray)
            // this is for recent transaction
            var mArray = []
            for (let i = 0; i < sortArray.length; i++) {
                if (sortArray[i].trx_type === 'debit') {
                    if (mArray.length <= 4) {
                        mArray.push(sortArray[i])
                    } else {
                        setIsLoading(false)
                        const removeDuplicates = mArray.filter((item, index, self) =>
                            index === self.findIndex((t) => (
                                t.destinationId === item.destinationId
                            ))
                        )
                        await dispatch(recentActivity(removeDuplicates))
                        await AsyncStorage.setItem("RECENTDATA", JSON.stringify(removeDuplicates))
                        return
                    }
                }
            }
            setIsLoading(false)
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
        })
    }, [])

    const getTransactionHistory = async (item) => {
        setHistoryDtl(true)
        setUserInfo(item)
    }

    const HeaderComponent = () => (
        <View style={styles.balanceCard}>
            <Text style={styles.walletTitle}>Wallet Balance</Text>
            <Text style={styles.amount}>{`$ ${user.wallet.toFixed(2)}`}</Text>
        </View>
    )

    const EmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>No Transaction History Found</Text>
        </View>
    )

    const returnTotal = () => {
        const total = userInfo.amount + userInfo.trx_charge
        return total.toFixed(2)
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, marginTop: 50 }}>
                <CustomLoader data={LOADER_DATA} />
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Transaction History' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <FlatList
                ListHeaderComponent={HeaderComponent}
                contentInset={{ right: 0, top: 0, left: 0, bottom: 30 }}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 70 : 0 }}
                data={transactionArray}
                extraData={transactionArray}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) =>
                    <View style={{
                        width: '95%', alignSelf: 'center', marginTop: index === 0 ? 30 : 0,
                        shadowOffset: { width: 0, height: 20 }, shadowRadius: 2, shadowOpacity: .9, shadowColor: COLORS.lightGray,
                        borderColor: COLORS.lightGray, borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: index === 0 ? 2 : 0,
                        borderTopLeftRadius: index === 0 ? 10 : 0, borderTopRightRadius: index === 0 ? 10 : 0, elevation: 10,
                        borderBottomWidth: index === transactionArray.length - 1 ? 2 : 0, borderBottomLeftRadius:
                            index === transactionArray.length - 1 ? 10 : 0, borderBottomRightRadius:
                            index === transactionArray.length - 1 ? 10 : 0
                    }}>
                        <View style={styles.flatListContainer}>
                            <View style={{
                                width: '90%', height: '90%', justifyContent: 'space-between',
                                alignItems: 'center', flexDirection: 'row', borderBottomColor: COLORS.color2, borderBottomWidth: index === transactionArray.length - 1 ? 0 : .2
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 17, fontFamily: FONTS.opneSans_SemiBold, color: COLORS.color3 }}>{item.source === 'stripe' ? item.source : item.receiverId.first_name + ' ' + item.receiverId.last_name}</Text>
                                    <Text style={styles.date}>{moment(item.createdAt).format('DD/MM/Y')}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={{ color: item.trx_type === 'credit' ? COLORS.green : COLORS.red, fontFamily: FONTS.opneSans_SemiBold }}>$ {parseFloat(item.amount).toFixed(2)}</Text>
                                    <Text style={styles.date}>{moment(item.createdAt).format('hh:mm A')}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => getTransactionHistory(item)}
                                    style={{ flex: .5, alignItems: 'flex-end', height: 40, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Text style={{
                                        backgroundColor: COLORS.lightGray, fontSize: 16
                                    }}>View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }

                ListEmptyComponent={EmptyComponent}
            />

            <Modal
                visible={isHistoryDtl}
                animationType='slide'
                style={{ backgroundColor: COLORS.lightGray }}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled={Platform.OS === 'ios' ? true : false}
                    style={{ flex: 1 }} >
                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 30, marginRight: 30 }}
                            onPress={() => setHistoryDtl(false)}
                        >
                            <Icon name='close' size={30} />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray, width: '100%' }}>
                            <Image
                                style={{ width: 70, height: 70, resizeMode: 'contain' }}
                                source={IMAGES.logo}
                            />
                            <Text style={{ fontFamily: 'OpenSans-Bold', color: COLORS.themeColor, fontSize: 25 }}>Transaction Successfull</Text>
                            <Text style={{ fontFamily: 'OpenSans-Bold', color: COLORS.color2, fontSize: 12, marginBottom: 5 }}>You have {userInfo.trx_type === 'debit' ? 'sent money' : 'received money'}</Text>
                        </View>
                        {
                            !isHistoryDtl ? null :
                                <View style={{ flex: 1, marginLeft: 30, marginTop: 10 }}>
                                    <Text>{moment(userInfo.date).format('DD/MM/Y') + '  ' + moment(userInfo.date).format('hh:mm A')}</Text>
                                    <Text>ID# {userInfo._id}</Text>

                                    <Text style={styles.historyTitle}>{userInfo.trx_type === 'credit' ? 'Sent by' : 'Sent to'}</Text>
                                    {
                                        userInfo.source === 'stripe' ? <Text>Stripe</Text> :
                                            <>
                                                <Text>{userInfo.receiverId.first_name + ' ' + userInfo.receiverId.last_name}</Text>
                                                <Text>{userInfo.receiverId.phone_number}</Text>
                                            </>
                                    }


                                    <Text style={styles.historyTitle}>{userInfo.trx_type === 'credit' ? 'Sent to' : 'Sent by'}</Text>
                                    <Text>{user.first_name + ' ' + user.last_name}</Text>
                                    <Text>{user.phone_number}</Text>

                                    <Text style={styles.historyTitle}>Amount</Text>
                                    <Text>$ {userInfo.amount}</Text>

                                    <Text style={styles.historyTitle}>Fee / Charge</Text>
                                    <Text>$ {userInfo.trx_charge}</Text>

                                    <Text style={[styles.historyTitle, { color: COLORS.themeColor }]}>Total Amount</Text>
                                    <Text>$ {returnTotal()}</Text>

                                </View>
                        }
                    </View>
                </KeyboardAvoidingView>
            </Modal>

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

export default TransactionHistory;