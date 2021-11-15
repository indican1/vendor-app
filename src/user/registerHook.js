import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Text, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/colors';
import auth from '@react-native-firebase/auth';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { BASE_URL, CHECK_USER, SIGNUP } from '../constants';
import axios from 'axios';
import AuthHeader from '../components/authHeader';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window')

Icon.loadFont()
const Register = ({ navigation }) => {

    const [phoneNo, setPhoneNo] = useState('')
    const [confirm, setConfirm] = useState('')
    const [code, setCode] = useState('')
    const [ssNo, setSSNo] = useState('')
    const [f_name, setF_Name] = useState('')
    const [l_name, setL_Name] = useState('')
    const [email, setEmail] = useState('')
    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [imageUri, setImageUri] = useState('')
    const [isModal, setIsModal] = useState(false)
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNo);
            setConfirm(confirmation);
            setIsLoading(false)
            await increamentStep()
        } catch (error) {
            Toast.show('Invalid phone number', Toast.SHORT, ['UIAlertController'], Toast.BOTTOM)
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
            Toast.show('Invalid code', Toast.SHORT, ['UIAlertController'], Toast.BOTTOM)
            setIsLoading(false)
        }
    }

    const checkUser = () => {
        setIsLoading(true)
        axios.post(`${BASE_URL}${CHECK_USER}`, {
            phone_number: phoneNo
        }).then(response => {
            if (response.data.status === 1) {
                signInWithPhoneNumber()
            } else {
                alert(response.data.msg)
                setIsLoading(false)
            }
        }).catch(error => {
            console.log('errror', error)
            setIsLoading(false)
        })
    }

    const takePics = (type) => {
        if (type === 'image') {
            ImagePicker.openPicker({
                width: 200,
                height: 200, compressImageMaxHeight: 400,
                compressImageMaxWidth: 400, includeBase64: true
            }).then((response) => {
                setImageUri(response)
                setIsModal(false)

            })
        } else {
            ImagePicker.openCamera({
                width: 200,
                height: 200, compressImageMaxHeight: 400,
                compressImageMaxWidth: 400, includeBase64: true
            }).then((response) => {
                setImageUri(response.path)
                setIsModal(false)
            })
        }
    }

    const increamentStep = () => {
        setStep(step + 1)
    }

    const decreamentStep = () => {
        if (step != 1) {
            setStep(step - 1)
        }
    }

    const _registerUser = () => {
        const formdata = new FormData();
        formdata.append("phone_number", phoneNo);
        formdata.append("ssno", ssNo)
        formdata.append("pin_code", pin)
        formdata.append("first_name", f_name)
        formdata.append("last_name", l_name)
        formdata.append("email", email)
        formdata.append('profile', {
            uri: imageUri.path,
            type: imageUri.mime,
            name: `${Math.random()}.${imageUri.mime.replace('image/', '',)}`,
        });
        setIsLoading(true)
        axios.post(`${BASE_URL}${SIGNUP}`, formdata).then((response) => {
            Toast.show(JSON.stringify(response.data.msg), Toast.LONG, ['UIAlertController'], Toast.BOTTOM);
            navigation.goBack()
            setIsLoading(false)
        }).catch(error => {
            alert(error)
            setIsLoading(false)
        })
    }

    const step1 = () => (
        <View style={{ flex: 1, marginTop: 30, alignItems: 'center' }}>
            <Title style={styles.title}>Welcome</Title>
            <CustomInput hint='Enter your mobile number' value={phoneNo} keyboardType='phone-pad' maxLength={15}
                onChange={(val) => setPhoneNo(val)} icon='call' secureTextEntry={false} 
                marginTop={50}
            />
            {
                isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{marginTop: 20}} /> :
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
                    Enter OTP to Signup
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
                {isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{marginTop: 20}} /> :
                <CustomButton title='Confirm' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={code === '' || code.length < 6 ? true : false} callFunction={() => confirmCode()} />}
                <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                    {`OTP has been sent to ${phoneNo}`}
                </Text>
            </View>
        </View>
    )

    const step3 = () => (
        <View style={{ flex: 1, marginTop: 30, alignItems: 'center' }}>
            <Text style={styles.title}>Welcome</Text>
            <CustomInput hint='Enter your social security number' value={ssNo} keyboardType='numeric' maxLength={15}
                onChange={(val) => setSSNo(val)} icon='call' secureTextEntry={false}
                marginTop={50} />

            <CustomButton title='Proceed' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={ssNo === '' || ssNo.length < 13 ? true : false} callFunction={() => increamentStep()} />
            <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                By proceeding you agree to our <Text style={{ color: COLORS.themeColor, fontWeight: 'bold' }}>Terms & Conditions</Text>
            </Text>
        </View>
    )

    const step4 = () => (
        <View style={{ flex: 1, marginTop: 30, alignItems: 'center' }}>
            <Text style={styles.title}>Welcome</Text>
            <CustomInput hint='Enter your first name' value={f_name} keyboardType='default' maxLength={10}
                onChange={(val) => setF_Name(val)} icon='person' secureTextEntry={false} 
                marginTop={50} />

            <CustomInput hint='Enter your last name' value={l_name} keyboardType='default' maxLength={10}
                onChange={(val) => setL_Name(val)} icon='person' secureTextEntry={false} 
                marginTop={10} />

            <CustomInput hint='Enter your email address' value={email} keyboardType='email-address' maxLength={25}
                onChange={(val) => setEmail(val)} icon='mail' secureTextEntry={false} 
                marginTop={10} />

            <CustomButton title='Proceed'backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={
                f_name === '' || f_name.length < 3 ||
                l_name === '' || l_name.length < 3 ||
                email === ''  || email.length < 6 ? true : false
            } callFunction={() => increamentStep()} />

            <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                By proceeding you agree to our <Text style={{ color: COLORS.themeColor, fontWeight: 'bold' }}>Terms & Conditions</Text>
            </Text>

        </View>
    )

    const step5 = () => (
        <View style={styles.container}>
            <View style={{ flex: 1, marginTop: 50, alignItems: 'center' }}>
                <Title style={styles.title}>
                    Create PIN to Signup
                </Title>
                <View style={{ marginTop: 30 }}>
                    <SmoothPinCodeInput
                        value={pin}
                        textContentType='oneTimeCode'
                        onTextChange={(code) => setPin(code)}
                        cellSize={36}
                        codeLength={6}
                        password
                    />
                </View>
                <Title style={[styles.title, {marginTop: 20}]}>
                    Confirm PIN to Signup
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
                <CustomButton title='Confirm' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={pin.length < 6 || confirmPin.length < 6 ? true : false} callFunction={() => {
                    if (pin != confirmPin) {
                        Toast.show('Pin not matched',Toast.SHORT, Toast.BOTTOM)
                    }else {
                        increamentStep()
                    }
                }} />
            </View>
        </View>
    )

    const step6 = () => (
        <View style={styles.container}>
            <View style={{ flex: 1, marginTop: 50, alignItems: 'center' }}>
                <Title style={styles.title}>
                    Welcome
                </Title>
                <TouchableOpacity style={{ marginTop: 30 }}
                    onPress={() => { setIsModal(true) }}
                >
                    {
                        !imageUri ?
                            <Icon style={{ marginTop: 7 }} name={'camera'} size={60} /> :
                            <Image style={{ width: 100, height: 100, borderRadius: 100 }} source={{ uri: imageUri.path }} />

                    }
                </TouchableOpacity>
                {
                    isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{marginTop: 20}} /> :
                    <CustomButton title='Confirm' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={imageUri === '' ? true : false} callFunction={() => _registerUser()} />
                }
            </View>
        </View>
    )


    return (
        <View style={styles.container}>
            <AuthHeader backgroundColor='transparent' navigation={navigation} callFunction={decreamentStep} step={step} />
            {
                step === 1 ? step1() : step === 2 ? step2() :
                    step === 3 ? step3() : step === 4 ? step4() :
                        step === 5 ? step5() : step6()
            }

            <Modal
                visible={isModal}
                animationType='slide'
                transparent={true}
            >
                <View style={{ height: 150, marginTop: height / 1.3, borderTopColor: '#ccc', borderTopWidth: 1 }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 10, }}
                        onPress={() => setIsModal(false)}
                    >
                        <Icon name='close' size={20} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            takePics('camera')
                        }}>
                            <Text>Take photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 10 }}
                            onPress={() => {
                                takePics('image')
                            }}
                        >
                            <Text>Choose photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: COLORS.white
    },
    title: {
        fontSize: 25, color: COLORS.black,
    },
});

export default Register;