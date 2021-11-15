import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import CustomInput from '../components/customInput';
import CustomButton from '../components/customButton';
import axios from 'axios';
import { BASE_URL, VALIDATE_ACCOUNT } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SednCash = ({ navigation }) => {

    const [phoneNo, setPhoneNo] = useState('+1')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const getInfo = async () => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem("token")
        axios.post(`${BASE_URL}${VALIDATE_ACCOUNT}`,{
            phone_number: phoneNo,
            amount: amount,
            transfer_to:"user"
        }, {
            headers: { Authorization: token }
        }).then(response=> {
            setIsLoading(false)
            if (response.data.status === 1) {
                return navigation.navigate('receipt',{
                    description: description,
                    data: response.data.result
                })
            }
            alert(JSON.stringify(response.data.msg))
        }).catch (error=> {
            alert(error)
            setIsLoading(false)
        })
    }

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Send Amount' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <Text style={{ margin: 30, fontSize: 18, fontWeight: 'bold' }}></Text>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <CustomInput hint='Enter phone number' value={phoneNo} keyboardType='phone-pad' maxLength={15}
                    onChange={(val) => setPhoneNo(val)} secureTextEntry={false} 
                    icon='call' marginTop={10}
                />

                <CustomInput hint='Enter amount' value={amount} keyboardType='phone-pad' maxLength={15}
                    onChange={(val) => setAmount(val)} secureTextEntry={false} 
                    icon='wallet' marginTop={10}
                />

                <CustomInput hint='Enter description' value={description} keyboardType='default' maxLength={30}
                    onChange={(val) => setDescription(val)} secureTextEntry={false}
                    icon='information-outline' marginTop={10}
                />

                {
                    isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{marginTop: 20}} /> :
                    <CustomButton title='Next' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={
                        amount.length < 1 ||
                        phoneNo.length < 11 ? true : false} callFunction={() => getInfo()} />
                }
                
            </View>
            {/* <Text style={{ color: COLORS.themeColor, alignSelf: 'center', fontSize: 12, marginTop: 10 }}>Your card will be stored for future use</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
})

export default SednCash;