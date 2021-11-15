import React, { } from 'react';
import { View, Image, Dimensions, StyleSheet, Text } from 'react-native';
import { COLORS } from './assets/colors';
import CustomButton from './components/customButton';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { FONTS } from './constants';

const {width, height} = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.firstView}>
                {/* <Image style={styles.backGroundImage}
                    source={require('./assets/images/img1.png')} /> */}
                <Image style={styles.logo}
                source={require('./assets/images/indiscanlogo.png')} />
                <Text style={styles.txtWelcome}>Welcome</Text>

            </View>
            <View style={styles.secondView}>
                <CustomButton title='LOGIN' titleColor={COLORS.white} backgroundColor={COLORS.themeColor} disabled={false} callFunction={() =>  navigation.navigate('login')} />
                <CustomButton title='REGISTER' titleColor={COLORS.themeColor} backgroundColor={COLORS.white} disabled={false} callFunction={() =>  navigation.navigate('register')} />
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    firstView: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: height/7 },
    secondView: { flex: 1, alignItems: 'center', marginTop: height/12 },
    logo: { width: 120, height: 60, marginTop: 30, resizeMode: 'contain', tintColor: COLORS.themeColor},
    txtWelcome: {color: COLORS.themeColor, fontSize: 23, marginTop: 5, fontFamily: FONTS.opneSans_SemiBold},
    backGroundImage: { flex: 1, width: width-40, height: height/4, resizeMode: 'contain' },
})

export default LandingScreen;