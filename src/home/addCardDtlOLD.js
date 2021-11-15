import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import { TextInput, Text, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

Icon.loadFont();

const AddCardDtl = ({ navigation }) => {

    const [cardNo, setCardNo] = useState('')
    const [expMonth, setExpMonth] = useState('')
    const [expYear, setExpYear] = useState('')
    const [cvv, setCvv] = useState('')
    const [country, setCountry] = useState('')
    
    const [isCard, setIsCard] = useState({
        visa: false,
        master: false,
        amex: false,
        discover: false
    })

    const ValidateCreditCardNumber = (val) => {

        var ccNum = val;
        var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        var amexpRegEx = /^(?:3[47][0-9]{13})$/;
        var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        var isValid = false;

        setCardNo(val)

        if (visaRegEx.test(ccNum)) {
            isValid = true;
            isCard.visa = true
            setIsCard({
                ...isCard,
                visa: isCard.visa
            })
        } else if(mastercardRegEx.test(ccNum)) {
            isValid = true;
            isCard.master = true
            setIsCard({
                ...isCard,
                visa: isCard.master
            })
        } else if(amexpRegEx.test(ccNum)) {
            isValid = true;
            isCard.amex = true
            setIsCard({
                ...isCard,
                visa: isCard.amex
            })
        } else if(discovRegEx.test(ccNum)) {
            isValid = true;
            isCard.discover = true
            setIsCard({
                ...isCard,
                visa: isCard.discover
            })
        }
      
        if(isValid) {
           alert("Thank You!");
        } else {
        //    alert(isValid);
        }
    }

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Add Card Details' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back' icon2='' icon3=''
                icon1Color={COLORS.white}
            />
            <KeyboardAwareScrollView>
                <View style={{ width: '90%', height: 100, justifyContent: 'flex-end', alignSelf: 'center' }}>
                    <Text style={{ color: COLORS.themeColor, alignSelf: 'flex-end', fontSize: 12 }}>How to find your card details!</Text>
                </View>
                <TextInput style={{ width: '90%', height: 40, marginTop: 30, alignSelf: 'center' }}
                    label="Enter Card Number"
                    selectionColor={COLORS.themeColor}
                    mode='outlined'
                    keyboardType='numeric'
                    onChangeText={(val)=>ValidateCreditCardNumber(val)}
                    maxLength={15}
                    theme={{ roundness: 5, colors: { primary: 'gray', accent: 'red' } }}
                    right={<TextInput.Icon name={() => <Icon style={{ marginTop: 7 }} name={isCard.visa ? 'mail' : 'call'} size={20} />} />}
                />

                <TextInput style={{ width: '90%', height: 40, marginTop: 20, alignSelf: 'center' }}
                    label="Expiry Month"
                    selectionColor={COLORS.themeColor}
                    mode='outlined'
                    keyboardType='numeric'
                    maxLength={11}
                    theme={{ roundness: 3, colors: { primary: 'gray', accent: 'red' } }}
                    right={<TextInput.Icon name={() => <Icon style={{ marginTop: 7 }} name={'call'} size={20} />} />}
                />

                <TextInput style={{ width: '90%', height: 40, marginTop: 20, alignSelf: 'center' }}
                    label="Expiry Year"
                    selectionColor={COLORS.themeColor}
                    mode='outlined'
                    keyboardType='numeric'
                    maxLength={11}
                    theme={{ roundness: 3, colors: { primary: 'gray', accent: 'red' } }}
                    right={<TextInput.Icon name={() => <Icon style={{ marginTop: 7 }} name={'call'} size={20} />} />}
                />

                <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput style={{ width: '60%', height: 40, marginTop: 20, alignSelf: 'center' }}
                        label="Enter Card CVV"
                        selectionColor={COLORS.themeColor}
                        mode='outlined'
                        keyboardType='numeric'
                        maxLength={11}
                        theme={{ roundness: 3, colors: { primary: 'gray', accent: 'red' } }}
                        right={<TextInput.Icon name={() => <Icon style={{ marginTop: 7 }} name={'call'} size={20} />} />}
                    />

                    <TextInput style={{ width: '36%', height: 40, marginTop: 20, alignSelf: 'center' }}
                        label="Country"
                        selectionColor={COLORS.themeColor}
                        mode='outlined'
                        keyboardType='numeric'
                        maxLength={11}
                        theme={{ roundness: 3, colors: { primary: 'gray', accent: 'red' } }}
                        right={<TextInput.Icon name={() => <Icon style={{ marginTop: 7 }} name={'call'} size={20} />} />}
                    />
                </View>

                <TouchableOpacity style={styles.btn}
                    onPress={()=>{
                        ValidateCreditCardNumber()
                    }}
                >
                    <Text style={{color: COLORS.white}}>Add Card</Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    btn: {
        width: '60%', height: 40, marginTop: 30, backgroundColor: COLORS.themeColor, borderRadius: 100,
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
})

export default AddCardDtl;