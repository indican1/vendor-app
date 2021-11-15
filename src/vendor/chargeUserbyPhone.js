import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import CustomInput from '../components/customInput';
import VendorReceipt from './vendorReceipt';
import axios from 'axios';
import { BASE_URL, VALIDATE_USER_ACCOUNT } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';


const ChargeUserByPhone = ({ navigation }) => {

    const [amount, setAmount] = useState('')
    const [amountWithTax, setAmountWithTax] = useState('')
    const [phoneNo, setPhoneNo] = useState('+1')
    const [result, setResult] = useState([])
    const [error, setError] = useState(true)
    const [isModal, setIsModal] = useState(false)

    const { user } = useSelector(state => ({
        user: state.userReducer.user,
    }));

    const checkUserInfo = async () => {
        const token = await AsyncStorage.getItem('token')
        await axios.post(`${BASE_URL}${VALIDATE_USER_ACCOUNT}`, {
            phone_number: phoneNo,
            amount: amount
        }, {
            headers: { Authorization: token }
        }).then(response => {
            if (response.data.status === 0) {
                Toast.show(JSON.stringify(response.data.msg, Toast.SHORT, ['UIAlertController'], Toast.BOTTOM))
            } else {
                setResult(response.data.result)
                setError(false)
            }
        }).catch(error => {
            console.log('errror', error)
        })
    }

    const showModal = () => {
        if (isModal) {
            setIsModal(false)
        } else {
            setIsModal(true)
        }
    }

    const calculateTax = (val) => {
        let tax = val * (user.commission / 100)
        let amountWithTax = parseFloat(parseFloat(val) + parseFloat(tax)).toFixed(2)
        setAmount(val)
        setAmountWithTax(amountWithTax)
    }

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <AppHeader navigation={navigation} title='Charge User' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <ProgressSteps activeLabelColor={COLORS.themeColor} activeStepNumColor={COLORS.themeColor} 
                completedStepIconColor={COLORS.themeColor} completedProgressBarColor={COLORS.themeColor}
                progressBarColor={COLORS.lightGray} activeStepIconBorderColor={COLORS.lightGray}
                labelFontFamily='OpenSans-Regular' labelColor={COLORS.color2} completedLabelColor={COLORS.color2}
            >
                <ProgressStep label="Amount" 
                    nextBtnDisabled={amount.length < 1 ? true : false}
                    labelFontFamily='OpenSans-Bold'
                >
                    <View style={{ alignItems: 'center' }}>
                        <CustomInput hint='Enter amount' value={amount} keyboardType='numeric' maxLength={6}
                            onChange={(val) => calculateTax(val)} icon='call' secureTextEntry={false}
                            marginTop={50}
                        />
                        <Text style={{ alignSelf: 'flex-start', marginTop: 20, marginLeft: 35 }}>{`Transaction Tax: ${user.commission}%`}</Text>
                        {
                            amountWithTax.length > 0 && !isNaN(amountWithTax) && (
                                <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: 35 }}>{`Total: ${amountWithTax}`}</Text>
                            )
                        }
                    </View>
                </ProgressStep>

                <ProgressStep label="Phone number"
                    nextBtnDisabled={phoneNo.length < 5 ? true : false}
                    onNext={async () => await checkUserInfo()}
                    errors={error}
                >
                    <View style={{ alignItems: 'center' }}>
                        <CustomInput hint='Enter customer mobile number' value={phoneNo} keyboardType='phone-pad' maxLength={15}
                            onChange={(val) => setPhoneNo(val)} icon='call' secureTextEntry={false}
                            marginTop={50}
                        />
                    </View>
                </ProgressStep>
                <ProgressStep label="Confirm"
                    onSubmit={() => setIsModal(true)}
                >
                    <View style={{ alignItems: 'center' }}>
                        <VendorReceipt navigation={navigation} isModal={isModal} data={result} callFunction={showModal} />
                    </View>
                </ProgressStep>
            </ProgressSteps>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white }
})

export default ChargeUserByPhone;