import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator} from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNLocation from "react-native-location";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, LOCATE_VENDORS } from '../constants';
import Toast from 'react-native-simple-toast';


const LocateVendors = ({ navigation }) => {

    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState('')
    const [vendorsArray, setVendorsArray] = useState([])

    useEffect(()=>{
        askLocationPermission()
    },[])

    const askLocationPermission = () => {
        RNLocation.configure({
            distanceFilter: 5.0
        });

        RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
                detail: "fine",
            }
        }).then(granted => {
            if (granted) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const region = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0.001
                        };
                        setLocation(region)
                        locateVendors(region)
                    },
                    (error) => {
                        console.log("Error", error);
                    },
                    { enableHighAccuracy: true, timeout: 20000 },
                );
            }else {
                Toast.show(JSON.stringify("Location permission denied", Toast.SHORT, ['UIAlertController'], Toast.BOTTOM))
                navigation.goBack()
            }

        })
    }

    const locateVendors = async (region) => {
        const token = await AsyncStorage.getItem('token')
        axios.post(`${BASE_URL}${LOCATE_VENDORS}`, {
            coordinates: [region.longitude, region.latitude],
            km: 20
        }, {
            headers: { Authorization: token }
        }).then(response => {
            console.log("RESPONSE:::::", response)
            if (response.data.status === 0) {
                Toast.show(JSON.stringify(response.data.msg, Toast.SHORT, ['UIAlertController'], Toast.BOTTOM))
                setLoading(false)
            }else {
                setVendorsArray(response.data.agents)
                setLoading(false)
            }
        }).catch(error => {
            console.log('errror', error)
        })
    }

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large' color={COLORS.themeColor} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AppHeader navigation={navigation} title='Cash Deposit' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                icon1Color={COLORS.white}
            />
            <MapView style={{
                flex: 1,
            }}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: location.latitudeDelta,
                    longitudeDelta: location.longitudeDelta
                }}
                showsUserLocation={true}
            >

                <Marker
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: location.latitudeDelta,
                        longitudeDelta: location.longitudeDelta
                    }}
                    pinColor={'indigo'}
                />
                {
                    vendorsArray.map((item, index)=> {
                        return (
                            <Marker key={index}
                                coordinate={{
                                    latitude: item.location.coordinates[1],
                                    longitude: item.location.coordinates[0],
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.001
                                }}
                                pinColor={'red'}
                            />
                        )
                    })
                }

            </MapView>

            {/* <View style={styles.card}>
                <View style={{ width: '100%', height: 50, backgroundColor: COLORS.themeColor, justifyContent: 'center' }}>
                    <Text style={{ color: COLORS.white, marginLeft: 10 }}>Cash Deposit</Text>
                </View>

                <Text style={{ color: 'orange', fontSize: 12, margin: 10 }}>Your first cash deposite needs to be be made through Biometric Cash Point</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={{ color: COLORS.white }}>Cash Point</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={{ color: COLORS.white }}>Cash Point</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.btn, {width: '98%', borderRadius: 0, alignSelf: 'center', bottom: 20, position: 'absolute' }]}>
                    <Text style={{ color: COLORS.white }}>How to cash deposit</Text>
                </TouchableOpacity>
            </View>
 */}

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, },
    card: {
        width: '97%', height: 300, backgroundColor: COLORS.white, alignSelf: 'center', position: 'absolute', bottom: 20,
        shadowOffset: { width: 0, height: 5 }, shadowOpacity: .2, shadowRadius: 2, borderRadius: 5, 
    },
    btn: {
        width: '45%', height: 40, marginTop: 5, backgroundColor: COLORS.themeColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center',
        flexDirection: 'row'
    },

})

export default LocateVendors;