import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Title } from 'react-native-paper';
import { COLORS } from '../assets/colors';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import AppHeader from '../components/header';
import { BASE_URL, WIDTH_DRAW_REQUEST } from '../constants';
import Toast from 'react-native-simple-toast';
import { StackActions } from '@react-navigation/native';


const WidthDrawAmount = ({ navigation }) => {

    const [amount, setAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const _handleWithDraw = async () => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem('token')
        axios.post(`${BASE_URL}${WIDTH_DRAW_REQUEST}`, {
            amount: amount,
        }, {
            headers: { Authorization: token }
        }).then(response => {
            if (response.data.status === 1) {
                Toast.show(JSON.stringify(response.data.msg, Toast.SHORT, ['UIAlertController'], Toast.BOTTOM))
                navigation.dispatch(
                    StackActions.popToTop()
                )
            }else {
                Toast.show(JSON.stringify(response.data.msg, Toast.SHORT, ['UIAlertController'], Toast.BOTTOM))
            }
        }).catch(error => {
            console.log('errror', error)
            setIsLoading(false)
        })
    }

    return (
        <View style={styles.container}>
             <AppHeader navigation={navigation} title='With Draw Request' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <View style={{ flex: 1, marginTop: 30, alignItems: 'center' }}>
                {/* <Title style={styles.title}>Forgot Pin</Title> */}
                <CustomInput hint='Enter Amount' value={amount} keyboardType='phone-pad' maxLength={15}
                    onChange={(val) => setAmount(val)} icon='call' secureTextEntry={false}
                    marginTop={50}
                />
                {
                    isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                        <CustomButton title='Proceed' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={amount === '' || amount.length < 1 ? true : false} callFunction={() => _handleWithDraw()} />
                }
                <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                    By proceeding you agree to our <Text style={{ color: COLORS.themeColor, fontWeight: 'bold' }}>Terms & Conditions</Text>
                </Text>
            </View>
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
})

export default WidthDrawAmount;