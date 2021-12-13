import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Keyboard, Image, Linking } from 'react-native';
import { Text,  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { COLORS } from '../assets/colors';
import { setUser } from '../redux/action/action';
import { BASE_URL, FONTS, IMAGES, SIGNIN } from '../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';


Icon.loadFont()
const Login = ({ navigation }) => {

    const [phoneNo, setPhoneNo] = useState('+1')
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch();

    useEffect(()=>{
        getPhoneNoFromStorage()
    },[])
    
    const getPhoneNoFromStorage = async () => {
        let phone_number = await AsyncStorage.getItem('phoneNo');
        if (phone_number) {
            setPhoneNo(phone_number)
        }
    }

    const login = () => {
        setIsLoading(true)
        axios.post(`${BASE_URL}${SIGNIN}`, {
            phone_number: phoneNo,
            pin_code: code,
            user_type: 'vendor'
        }).then(response => {
            if (response.data.status === 0) {
                Keyboard.dismiss()
                Toast.show({
                    type:  'error',
                    text1: 'Opps!',
                    text2: response.data.msg,
                    position: 'top'
                });
                setCode("")
                setIsLoading(false)
            } else {
                AsyncStorage.setItem('token', response.data.token)
                AsyncStorage.setItem('phoneNo', phoneNo)
                dispatch(setUser(response.data.user))
                // for memory leak prevention
                return () =>{
                    setIsLoading(false)
                }
            }
        }).catch(error => {
            console.log('errror', error)
            setIsLoading(false)
        })
    }

    return (
        <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps='always'>
            {/* <AuthHeader backgroundColor='transparent' navigation={navigation} step={1} /> */}
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <View style={{ flex: 1, alignItems: 'center', marginTop: 130 }}>

                <Image 
                    style={{width: 120, height: 55, resizeMode: 'contain'}}
                    source={IMAGES.logo}
                />
                <Text style={styles.title}>Welcome</Text>
                <CustomInput hint='Enter your mobile number' value={phoneNo} keyboardType='phone-pad' maxLength={15} 
                    onChange={(val) => setPhoneNo(val)} icon='call' secureTextEntry = {false} 
                    marginTop={50}
                />

                <CustomInput hint='Enter your pin code' value={code} keyboardType='numeric' maxLength={6} 
                    onChange={(val) => setCode(val)} secureTextEntry = {true} 
                    icon='lock-closed' marginTop={10}
                />

                     {/* forgot pin */}
                     <TouchableOpacity style={styles.forgotBtn}
                    onPress={()=>navigation.navigate('forgotPin',{
                        screen: ''
                    })}
                >
                    <Text style={styles.forgotTxt}>Forgot Pin</Text>
                </TouchableOpacity>

                {
                    isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{marginTop: 20}} /> :
                    <CustomButton title='Proceed' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={phoneNo === '' || phoneNo.length < 11 
                                || code === '' || code.length < 6 ? true : false} callFunction={() => login()} />
                }
                <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}
                    onPress={()=>Linking.openURL('https://indiscanprivacypolicy.com/')}
                    >
                    By proceeding you agree to our <Text style={{ color: COLORS.themeColor, fontWeight: 'bold' }}>Terms & Conditions</Text>
                </Text>
            </View>
        </KeyboardAwareScrollView>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: COLORS.white
    },
    title: {
        fontSize: 25, color: COLORS.themeColor, fontFamily: FONTS.opneSans_SemiBold,
    },
    btn: {
        width: '80%', height: 40, marginTop: 20, backgroundColor: '#ccc', borderRadius: 100, justifyContent: 'center', alignItems: 'center'
    },
    forgotBtn: {
        width: 120, height: 40, alignItems: 'center', justifyContent: 'center',
        alignSelf: 'center', marginRight: 10,
    },
    forgotTxt: {
        color: COLORS.themeColor, fontFamily: FONTS.opneSans_SemiBold
    }
})

export default Login;