import React, { } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title } from 'react-native-paper';
import { COLORS } from '../assets/colors';
import CustomButton from '../components/customButton';
import AppHeader from '../components/header';

const {width, height} = Dimensions.get('window');

const ChargeUserOptions = ({ navigation }) => {

    const navigateToScreen = (screen) => {
        navigation.navigate(screen)
    }
    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Confirm Identity' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <Title style={{alignSelf: 'center', marginTop: 50, color: COLORS.color1, fontFamily: 'OpenSans-Bold'}}>Please confirm your identity</Title>

            <View style={styles.btnView}>
                <CustomButton title='Face Verification' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={false} callFunction={() => navigateToScreen('chargeUserbyFace')} />
                {/* <CustomButton title='Fingerprint' disabled={false} callFunction={() => alert('coming soon')} /> */}
                <CustomButton title='Phone Number' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={false} callFunction={() => navigateToScreen('chargeUserbyPhone')} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white},
    btnView: {flex: 1, alignItems: 'center', marginTop: 40}
})

export default ChargeUserOptions;