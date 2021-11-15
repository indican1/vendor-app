import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Modal, Dimensions, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import { useSelector, useDispatch } from 'react-redux';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/customButton';
import { BASE_URL, FONTS, SHARE_BALANCE } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { updateBalance } from '../redux/action/action';
import { StackActions } from '@react-navigation/native';


Icon.loadFont();
const { width, height } = Dimensions.get('window');
const Receipt = ({ route, navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [pin, setPin] = useState('')
    const [transactionSuccss, setTransactionSuccess] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState('Transaction completed successfully')

    const description = route.params.description
    const data = route.params.data

    const { user } = useSelector(state => ({
        user: state.userReducer.user
    }))
    const dispatch = useDispatch()

    const checkPin = async () => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem("token")
        axios.post(`${BASE_URL}${SHARE_BALANCE}`, {
            receiver_id: data.receiver_id,
            amount: data.amount,
            pin_code: pin,
            description: description,
            transfer_to: "user"
        }, {
            headers: { Authorization: token }
        }).then(response => {
            setIsLoading(false)
            setIsModal(false)
            setPin('')
            if (response.data.status === 1) {
                setIsModal(false)
                setTransactionMessage(response.data.msg)
                setIsModal(true)
                setTransactionSuccess(true)
                dispatch(updateBalance(response.data.wallet))
                return;
            }
            alert(JSON.stringify(response.data.msg))
        }).catch(error => {
            setIsLoading(false)
            setIsModal(false)
            setPin('')
        })
    }

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Receipt' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <Image style={styles.icon}
                source={require('../assets/images/indiscanlogo.png')}
            />

            <View style={{
                width: '90%', height: 150, backgroundColor: COLORS.white, borderColor: COLORS.lightGray, borderWidth: 1,
                alignSelf: 'center', borderRadius: 10, shadowOffset: { width: 0, height: 1 },
                shadowColor: COLORS.lightGray, shadowOpacity: .9, elevation: 10, shadowRadius: 2, flexDirection: 'row'
            }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.label}>Pay To</Text>
                        <Text style={styles.accountTitle}>{data.receiver_name}</Text>
                        <Text style={styles.phone}>{data.receiver_phone}</Text>
                    </View>
                    <View style={{ flex: .5, justifyContent: 'center' }}>
                        <Text style={styles.label}>Amount</Text>
                        <Text style={[styles.accountTitle, { marginTop: 2 }]}>${data.amount}</Text>
                    </View>
                </View>

                <View style={{ flex: .8 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.label}>From</Text>
                        <Text style={styles.accountTitle}>{user.first_name + ' ' + user.last_name}</Text>
                        <Text style={styles.phone}>{user.phone_number}</Text>
                    </View>
                    <View style={{ flex: .5, justifyContent: 'center' }}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={[styles.accountTitle, { marginTop: 2 }]}>{data.date}</Text>

                    </View>
                </View>
            </View>

            <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                <TouchableOpacity style={styles.btn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.btnTitle}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, { marginRight: 0, backgroundColor: COLORS.themeColor }]}
                    onPress={() => setIsModal(true)}
                >
                    <Text style={[styles.btnTitle, { color: COLORS.white }]}>Confirm</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isModal}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setIsModal(false)}
            >
                <KeyboardAvoidingView

                    behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled={Platform.OS === 'ios' ? true : false}
                    style={{ justifyContent: 'flex-end', flex: 1 }}
                >
                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 10 }}
                            onPress={() => setIsModal(false)}
                        >
                            <Icon name='close' size={20} />
                        </TouchableOpacity>
                        {
                            transactionSuccss ?
                                <>
                                    <View>
                                        <Text style={{ color: COLORS.green, fontFamily: FONTS.openSans_Bold, fontSize: 20, textAlign: 'center' }}>Transaction</Text>
                                        <Text style={{ color: COLORS.green, fontFamily: FONTS.opneSans_SemiBold, textAlign: 'center' }}>Successfully</Text>
                                        <Text style={{ color: COLORS.color3, marginTop: 30, fontSize: 18, fontFamily: FONTS.opneSans_SemiBold, textAlign: 'center' }}>{transactionMessage}</Text>
                                        <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>

                                            <TouchableOpacity style={[styles.btn, { marginRight: 0, backgroundColor: COLORS.themeColor }]}
                                                onPress={() =>
                                                    navigation.dispatch(
                                                        StackActions.popToTop()
                                                    )
                                                }
                                            >
                                                <Text style={[styles.btnTitle, { color: COLORS.white }]}>Ok</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </> :
                                <>
                                    <View style={{ flex: 1, }}>
                                        <Image style={styles.img}
                                            source={require('../assets/images/indiscanlogo.png')}
                                        />
                                        <Text style={{ alignSelf: 'center', color: COLORS.color1, fontFamily: FONTS.opneSans_SemiBold }}>Enter six digit pin to confirm</Text>
                                        <SmoothPinCodeInput
                                            autoFocus={true}
                                            value={pin}
                                            textContentType='oneTimeCode'
                                            onTextChange={(val) => setPin(val)}
                                            cellSize={36}
                                            cellSpacing={10}
                                            codeLength={6}
                                            password
                                            restrictToNumbers={true}
                                            containerStyle={{
                                                marginTop: 10
                                            }}
                                            keyboardType='numeric'
                                        />
                                    </View>
                                    <View style={{ width: '100%', alignItems: 'center', flex: .8 }}>
                                        {
                                            isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                                                <View style={{ marginTop: 15, width: '100%', alignItems: 'center' }}>

                                                    <CustomButton title='Proceed' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={pin.length < 6 ? true : false}
                                                        callFunction={() => checkPin()} />
                                                </View>
                                        }
                                    </View>
                                </>
                        }

                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },

    icon: { width: 120, height: 120, resizeMode: 'contain', alignSelf: 'center', tintColor: COLORS.themeColor },

    label: { marginLeft: 20, fontFamily: FONTS.opneSans_SemiBold, color: COLORS.color2, },

    accountTitle: { fontFamily: FONTS.openSans_Regular, color: COLORS.themeColor, marginLeft: 20, marginTop: 5 },

    phone: { fontFamily: FONTS.openSans_Regular, color: COLORS.color2, marginLeft: 20, marginTop: 5 },

    row: { flexDirection: 'row', marginTop: 20 },

    btn: {
        flex: 1, height: 40, borderRadius: 5, backgroundColor: COLORS.white, marginRight: 30,
        justifyContent: 'center', alignItems: 'center', borderWidth: .5, borderColor: COLORS.themeColor
    },

    btnTitle: { color: COLORS.themeColor, fontFamily: FONTS.opneSans_SemiBold },

    modalView: {
        width: width, height: height / 3, borderTopColor: '#ccc', borderTopWidth: 1,
        backgroundColor: COLORS.white, alignSelf: 'center', shadowOffset: { width: 0, height: -5, }, shadowOpacity: 0.23,
        shadowRadius: 2.62, elevation: 10, justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 30, borderTopLeftRadius: 30
    },

    img: {
        width: 70, height: 70, alignSelf: 'center', resizeMode: 'contain', tintColor: COLORS.themeColor
    }
})

export default Receipt;