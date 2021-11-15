import React, { } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FONTS } from '../constants';

Ionicons.loadFont();

const AddCash = ({ navigation }) => {


    const { wallet } = useSelector(state=> ({
        wallet: state.userReducer.user.wallet
    }))

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Add Cash' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <View style={styles.balanceCard}>
                <View style={{ width: '90%', height: '100%', alignSelf: 'flex-end', }}>
                    <Text style={{ color: COLORS.color2, marginTop: 20, fontSize: 12, fontFamily: FONTS.openSans_Regular }}>Wallet Balance</Text>
                    <Text style={{ color: COLORS.color3, marginTop: 10, 
                    fontSize: 18, fontFamily: FONTS.openSans_Regular  }}>{`$ ${wallet.toFixed(2)}`}</Text>
                    {/* <Text style={{ color: COLORS.title, fontSize: 12, marginLeft: 20, fontSize: 9 }}>{`Your remaining lamit for today is: ${5000}`}</Text> */}
                </View>
            </View>
            
            <Text style={{ margin: 20, fontFamily: FONTS.opneSans_SemiBold, color: COLORS.color3 }}>Choose method to add Cash</Text>

            <View style={[styles.balanceCard, {marginTop: 0}]}>

                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }}
                    onPress={()=>navigation.navigate('addCard')}
                >
                    <View style={styles.iconView}>
                        <Image 
                            source={require('../assets/images/card.png')}
                            style={{width: 30, height: 30, resizeMode: 'contain', tintColor: COLORS.color3}}
                        />
                    </View>
                    <View style={styles.titleView}>
                        <Text style={styles.title}>Add Debit Card</Text>
                    </View>
                    <View style={styles.iconView}>
                        <Ionicons style={{ marginRight: 20 }} color={COLORS.color3} name='ios-arrow-forward' size={30} />
                    </View>
                </TouchableOpacity>
                <View style={{width: '80%', height: .5, backgroundColor: COLORS.color2, alignSelf: 'center'}} />
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', }}
                    onPress={()=>navigation.navigate('locateVendors')}
                >
                    <View style={styles.iconView}>
                        <Ionicons name='location-outline' color={COLORS.color3} size={30} />
                    </View>

                    <View style={styles.titleView}>
                        <Text style={styles.title}>Locate Vendors</Text>
                    </View>

                    <View style={styles.iconView}>
                        <Ionicons style={{ marginRight: 20 }} color={COLORS.color3} name='ios-arrow-forward' size={30} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    balanceCard: { width: '90%', height: 120, borderRadius: 10, backgroundColor: COLORS.white, 
    alignSelf: 'center', marginTop: 20, shadowOffset: {width: 0, height: 2}, shadowColor: COLORS.color4, shadowRadius: 2.62,
    elevation: 10, shadowOpacity: 0.23 },
    iconView: { width: 60, alignItems: 'flex-end', justifyContent: 'center' },
    titleView: { flex: 1, justifyContent: 'center' },
    title: {marginLeft: 20, fontFamily: FONTS.opneSans_SemiBold, color: COLORS.color3}
})

export default AddCash;