import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import Icon from 'react-native-vector-icons/Ionicons';
import { CreditCardInput } from "react-native-input-credit-card";
import Stripe from 'react-native-stripe-api';
import axios from 'axios';
import { BASE_URL, STRIPE_CHARGE } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../components/customInput';
import CustomButton from '../components/customButton';
import { updateBalance } from '../redux/action/action';
import { useDispatch, useSelector } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

const apiKey = 'pk_live_51JrEcFBoQHeLfmKb4WuUGrznfcwi2i0Rcoed048E4BSgdS3oeoBuCzBaPmxq2lAbQYgeD1zxJs1KkzmeaRyUJCLH005RayYQPr';
const client = new Stripe(apiKey);

Icon.loadFont();

const AddCardDtl = ({ navigation }) => {

    const [values, setValues] = useState('')
    const [amount, setAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch();
    const { user } = useSelector(state => ({
        user: state.userReducer.user,
    }));

    const submit = async () => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem("token")
        const stripe_token = await client.createToken({
            number: values.values.number,
            exp_month: values.values.expiry.split('/')[0],
            exp_year: values.values.expiry.split('/')[1],
            cvc: values.values.cvc,
        });
        if (stripe_token) {
            axios.post(`${BASE_URL}${STRIPE_CHARGE}`,
                {
                    stripe_token: stripe_token.id,
                    amount: amount,
                    different_card: true,
                    user_type: user.account_type
                },
                {
                    headers: { Authorization: token }
                }).then(response => {
                    if (response.data.status === 1) {
                        Alert.alert(
                            "Success",
                            JSON.stringify(response.data.msg),
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => {
                                        navigation.dispatch(
                                            StackActions.popToTop()
                                        )
                                    },
                                    style: "cancel"
                                },
                                {
                                    text: "OK", onPress: () => {
                                        navigation.dispatch(
                                            StackActions.popToTop()
                                        )
                                    }
                                }
                            ]
                        );
                        dispatch(updateBalance(response.data.wallet))
                        setIsLoading(false)
                        return;
                    }
                }).catch(error => {
                    setIsLoading(false)
                    alert('Something went wrong')
                })
        }
    }


    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Add Card Details' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back' icon2='' icon3=''
                icon1Color={COLORS.white}
            />
            <KeyboardAwareScrollView>
                <View style={{ marginTop: 20 }}>
                    <CreditCardInput
                        requiresCVC
                        onChange={(val) => setValues(val)}
                    />
                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <CustomInput hint='Enter amount in USD' value={amount} keyboardType='numeric' maxLength={6}
                        onChange={(val) => setAmount(val)} secureTextEntry={false}
                        icon='wallet' marginTop={10}
                    />
                </View>

                <View style={{ alignItems: 'center' }}>
                    {
                        isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                            <CustomButton title='Submit' backgroundColor={COLORS.themeColor} titleColor={COLORS.white}  disabled={
                                !values || values.values.number.length < 15 || values.values.expiry.length < 5 || !values.values.cvc || !amount ? true : false
                            } callFunction={() => submit()} />
                    }
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    btn: {
        width: '60%', height: 40, marginTop: 30, backgroundColor: COLORS.themeColor, borderRadius: 100,
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
})

export default AddCardDtl;