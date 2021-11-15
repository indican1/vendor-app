import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, Title } from 'react-native-paper';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { COLORS } from '../assets/colors';
import AuthHeader from '../components/authHeader';
import CustomInput from '../components/customInput';
import { BASE_URL, CHECK_USER, FORGOT_PIN, FORGOT_TOKEN } from '../constants';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import CustomButton from '../components/customButton';
import axios from 'axios';
import { StackActions } from '@react-navigation/native';

const ForgotPin = ({ route, navigation }) => {

    const screen = route.params.screen

    const [phoneNo, setPhoneNo] = useState('+1')
    const [code, setCode] = useState('')
    const [confirm, setConfirm] = useState('')
    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [step, setStep] = useState(1)
    const [token, setToken] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // for checking phone no in data base
    const checkUser = () => {
        setIsLoading(true)
        axios.post(`${BASE_URL}${CHECK_USER}`, {
            phone_number: phoneNo
        }).then(response => {
            if (response.data.status === 1) {
                Toast.show({
                    type: 'error',
                    text1: 'Opps!',
                    text2: 'Phone no does not exist!',
                    position: 'top'
                });
                setIsLoading(false)
            } else {
                signInWithPhoneNumber()
                getToken()
                setIsLoading(false)

            }
        }).catch(error => {
            console.log('errror', error)
            setIsLoading(false)
        })
    }

    const signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNo);
            setConfirm(confirmation);
            setIsLoading(false)
            increamentStep()
        } catch (error) {
            console.log("ERROR:::", error)
            Toast.show({
                type: 'error',
                text1: 'Opps!',
                text2: 'Invalid phone number OR auth/too-many-requests',
                position: 'top'
            });
            setIsLoading(false)
        }
    }

    const confirmCode = async () => {
        try {
            setIsLoading(true)
            await confirm.confirm(code);
            await increamentStep()
            setIsLoading(false)
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Opps!',
                text2: 'Invalid OTP',
                position: 'top'
            });
            setIsLoading(false)
        }
    }

    const getToken = () => {
        axios.post(`${BASE_URL}${FORGOT_TOKEN}`, {
            phone_number: phoneNo,
            user_type:  'vendor'
        }).then(response => {
            if (response.data.status === 1) {
                setToken(response.data.token)
            }
        }).catch(error => {
            console.log('errror', error)
            setIsLoading(false)
        })
    }

    const forgotPin = () => {
        setIsLoading(true)
        axios.post(`${BASE_URL}${FORGOT_PIN}`, {
            pin_code: pin
        }, {
            headers: { Authorization: token }
        }).then(response => {
            if (response.data.status === 1) {
                Toast.show({
                    type: 'success',
                    text1: 'Opps!',
                    text2: 'Password changes successfully!',
                    position: 'top'
                });
                navigation.dispatch(
                    StackActions.popToTop()
                )
            }
            console.log('RESPONSE CHANGE::::', response)
            setIsLoading(false)
        }).catch(error => {
            console.log('errror', error)
            setIsLoading(false)
        })
    }

    const increamentStep = () => {
        setStep(step + 1)
    }

    const step1 = () => (
        <View style={{ flex: 1, marginTop: 30, alignItems: 'center' }}>
            <Title style={styles.title}>{
                screen === 'drawer' ? 'Change Pin' : 'Forgot Pin'
            }</Title>
            <CustomInput hint='Enter your mobile number' value={phoneNo} keyboardType='phone-pad' maxLength={15}
                onChange={(val) => setPhoneNo(val)} icon='call' secureTextEntry={false}
                marginTop={50}
            />
            {
                isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                    <CustomButton title='Proceed' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={phoneNo === '' || phoneNo.length < 11 ? true : false} callFunction={() => checkUser()} />
            }
            <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                By proceeding you agree to our <Text style={{ color: COLORS.themeColor, fontWeight: 'bold' }}>Terms & Conditions</Text>
            </Text>
        </View>
    )

    const step2 = () => (
        <View style={styles.container}>
            <View style={{ flex: 1, marginTop: 50, alignItems: 'center' }}>
                <Title style={styles.title}>
                    Enter OTP to confirm
                </Title>
                <View style={{ marginTop: 30 }}>
                    <SmoothPinCodeInput
                        autoFocus={true}
                        value={code}
                        textContentType='oneTimeCode'
                        onTextChange={(code) => setCode(code)}
                        cellSize={36}
                        cellSpacing={10}
                        codeLength={6}
                        restrictToNumbers={true}
                        password
                    />
                </View>
                {isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                    <CustomButton title='Confirm' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={code === '' || code.length < 6 ? true : false} callFunction={() => confirmCode()} />}
                <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                    {`OTP has been sent to ${phoneNo}`}
                </Text>
            </View>
        </View>
    )

    const step3 = () => (
        <View style={styles.container}>
            <View style={{ flex: 1, marginTop: 50, alignItems: 'center' }}>
                <Title style={styles.title}>
                    Create PIN
                </Title>
                <View style={{ marginTop: 30 }}>
                    <SmoothPinCodeInput
                        value={pin}
                        textContentType='oneTimeCode'
                        onTextChange={(val) => setPin(val)}
                        cellSize={36}
                        codeLength={6}
                        password
                    />
                </View>
                <Title style={[styles.title, { marginTop: 20 }]}>
                    Confirm PIN
                </Title>
                <View style={{ marginTop: 20 }}>
                    <SmoothPinCodeInput
                        value={confirmPin}
                        textContentType='oneTimeCode'
                        onTextChange={(val) => setConfirmPin(val)}
                        cellSize={36}
                        codeLength={6}
                        password
                    />
                </View>
                {isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                    <CustomButton title='Confirm' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={pin.length < 6 || confirmPin.length < 6 ? true : false} callFunction={() => {
                        if (pin != confirmPin) {
                            Toast.show({
                                type: 'error',
                                text1: 'Opps!',
                                text2: 'Pin not matched',
                                position: 'top'
                            });
                        } else {
                            forgotPin()
                        }
                    }} />}
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <AuthHeader backgroundColor='transparent' navigation={navigation} step={1} />
            <Toast ref={(ref) => Toast.setRef(ref)} />
            {
                step === 1 ? step1() : step === 2 ? step2() : step3()
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: COLORS.white
    },
    title: {
        fontSize: 25, color: COLORS.color1,
    },
})

export default ForgotPin;