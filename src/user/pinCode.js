import React, { useState, createRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Title, Text } from 'react-native-paper';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

Icon.loadFont()
const PinCode = ({ navigation }) => {
    const [code, setCode] = useState('')

    // const { userName } = useSelector(state => ({
    //     userName: state.userReducer.userName,
    // }));


    pinInput = createRef();
    const _checkCode = (code) => {
        if (code != '12345') {
            this.pinInput.current.shake()
                .then(() => setCode(''));
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, marginTop: 50, alignItems: 'center' }}>
                <Icon name='ios-arrow-back' size={20} style={{alignSelf: 'flex-start', marginLeft: 30, marginTop: 10}} 
                    onPress={()=>navigation.goBack()}
                />
                <Title style={styles.title}>
                    Enter PIN to Login
                </Title>
                <View style={{ marginTop: 30 }}>
                    <SmoothPinCodeInput
                        ref={this.pinInput}
                        value={code}
                        onTextChange={(code) => setCode(code)}
                        onFulfill={_checkCode}
                        cellSize={36}
                        codeLength={5}
                        password
                    />
                </View>

                <TouchableOpacity style={styles.btn}>
                    <Text >Proceed</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                    Do not remember your pin? <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 14 }}>Forgot PIN</Text>
                </Text>

            </View>
            <View style={{ flex: 1, }}>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        width: '80%', marginTop: 20,
    },
    btn: {
        width: '80%', height: 40, marginTop: 30, backgroundColor: '#ccc', borderRadius: 100, justifyContent: 'center', alignItems: 'center'
    },

})

export default PinCode;