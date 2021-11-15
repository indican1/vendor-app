import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Modal, Dimensions, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import { COLORS } from '../assets/colors';
import { useSelector, useDispatch } from 'react-redux';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/customButton';
import { BASE_URL, CHARGE_USER, FONTS } from '../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { updateBalance } from '../redux/action/action';
import { StackActions } from '@react-navigation/native';

Icon.loadFont();
const { width, height } = Dimensions.get('window');
const VendorReceipt = ({navigation, ...props}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [pin, setPin] = useState('')
    const [transactionSuccss, setTransactionSuccess] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState('Transaction completed successfully')

    const { user } = useSelector(state=>({
        user: state.userReducer.user
    }))
    
    const dispatch = useDispatch()
    
    const chargeUser = async () => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem('token')
        axios.post(`${BASE_URL}${CHARGE_USER}`, {
            customer_id: props.data.customer_id,
            amount: props.data.amount,
            pin_code: pin,
            description: ''
        }, {
            headers: { Authorization: token }
        }).then(response => {
            if (response.data.status === 1) {
                setTransactionMessage(response.data.msg)
                setTransactionSuccess(true)
                dispatch(updateBalance(response.data.wallet))
                setIsLoading(false)
                return;
            }else { 
                setIsLoading(false)
                Toast.show(JSON.stringify(response.data.msg, Toast.SHORT, ['UIAlertController'], Toast.BOTTOM))
            }
        }).catch(error => {
            console.log('errror', error)
            setIsLoading(false)
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Pay To</Text>
                <View style={{flex: 1}}>
                    <Text style={styles.accountTitle}>{user.first_name+' '+user.last_name}</Text>
                    <Text style={{marginTop: 10}}>{user.phone_number}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>From</Text>
                <View style={{flex: 1}}>
                    <Text style={styles.accountTitle}>{props.data.customer_name}</Text>
                    <Text style={{marginTop: 10}}>{props.data.customer_phone}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Amount</Text>
                <View style={{flex: 1}}>
                    <Text>${props.data.amount}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Date</Text>
                <View style={{flex: 1}}>
                    <Text>{props.data.date}</Text>
                </View>
            </View>

            <Modal
                visible={props.isModal}
                animationType='slide'
                transparent={true}
            >

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled={Platform.OS === 'ios' ? true : false} 
                    style={{justifyContent: 'flex-end', flex: 1}} >
                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 10, }}
                            onPress={() => props.callFunction()}
                        >
                            <Icon name='close' size={20} />
                        </TouchableOpacity>
                        {
                             transactionSuccss ? 
                             <>
                                 <View style={{flex: 1}}>
                                     <Text style={{color: COLORS.green, fontFamily: FONTS.openSans_Bold, fontSize: 20, textAlign: 'center'}}>Transaction</Text>
                                     <Text style={{color: COLORS.green, fontFamily: FONTS.opneSans_SemiBold, textAlign: 'center'}}>Successfully</Text>
                                     <Text style={{color: COLORS.color3, marginTop: 20, fontSize: 18, fontFamily: FONTS.opneSans_SemiBold, textAlign: 'center'}}>{transactionMessage}</Text>
                                     <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 50 }}>
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
                            <Text style={{ alignSelf: 'center', }}>Enter your six digit pin</Text>
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
                        <View style={{ width: '100%', alignItems: 'center', flex: .6 }}>
                            {
                                isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                                <View style={{ marginTop: 15, width: '100%', alignItems: 'center' }}>
                                    <CustomButton title='Proceed' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} 
                                    disabled={pin.length < 6 ? true : false} callFunction={() => chargeUser()} />
                                </View>
                            }
                        </View>
                        </>}
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1},
    icon: {width: 60, height: 70, resizeMode: 'contain', alignSelf: 'center'},
    label: {width: 100, marginLeft: 20, fontWeight: 'bold'},
    accountTitle: {fontWeight: 'bold'},
    row: {flexDirection: 'row', marginTop: 20, width: '80%'},
    btn: {
        flex: 1, height: 30, borderRadius: 5, backgroundColor: COLORS.white, marginRight: 30,
        justifyContent: 'center', alignItems: 'center', borderWidth: .5, borderColor: COLORS.themeColor
    },
    btnTitle: {color: COLORS.white},
    modalView: {
        width: width , height: height / 3, borderTopColor: '#ccc', borderTopWidth: 1,
        backgroundColor: COLORS.white, alignSelf: 'center', shadowOffset: { width: 0, height: -5, }, shadowOpacity: 0.23,
        shadowRadius: 2.62, elevation: 10, justifyContent: 'center', alignItems: 'center',  borderTopRightRadius: 30, borderTopLeftRadius: 30
    },
    img: {
        width: 70, height: 70, alignSelf: 'center', resizeMode: 'contain', tintColor: COLORS.themeColor
    }
})

export default VendorReceipt;