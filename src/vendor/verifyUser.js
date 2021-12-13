import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';
import storage from '@react-native-firebase/storage';
import { BASE_URL, JUST_USER_VERIFY } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class VerifyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            takingPic: false,
            box: null,
            leftEyePosition: null,
            rightEyePosition: null,
            noOfFaces: 0,
            amount: '',
            amountWithTax: '',
            isModal: true,
            isImgLoading: false,
            noDataFound: false,
            result: ''
        };
    }

    onFaceDetected = ({faces}) => {
        if (faces[0]) {
          this.setState({
            noOfFaces: faces.length,
            box: {
              width: faces[0].bounds.size.width,
              height: faces[0].bounds.size.height,
              x: faces[0].bounds.origin.x,
              y: faces[0].bounds.origin.y,
              yawAngle: faces[0].yawAngle,
              rollAngle: faces[0].rollAngle,
            },
            rightEyePosition: faces[0].rightEyePosition,
            leftEyePosition: faces[0].leftEyePosition,
          });
        } else {
          this.setState({
            box: null,
            rightEyePosition: null,
            leftEyePosition: null,
            noOfFaces: 0
          });
        }
    };

    takePicture = async () => {
        if (this.camera && !this.state.takingPic) {
            let options = {
                quality: 0.85,
                fixOrientation: true,
                forceUpOrientation: true,
                base64: true,
                width: 200,
                height: 200, compressImageMaxHeight: 400,
                compressImageMaxWidth: 400
            };

            this.setState({ takingPic: true });

            try {
                const data = await this.camera.takePictureAsync(options);
                this.setState({ takingPic: false}, () => {
                    this.uploadImageToFirebase(data.uri)
                });
            } catch (err) {
                this.setState({ takingPic: false });
                Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
                return;
            }
        }
    };

    uploadImageToFirebase = async (imgUri) => {
        this.setState({isImgLoading: true})
        const uri  = imgUri;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
            .ref(filename)
            .putFile(uploadUri);
        try {
            await task;
            storage().ref(task._ref.path).getDownloadURL().then((url)=>{
                this.checkUserInfo(url)
            })
        } catch (e) {
            this.setState({
                isImgLoading: false,
                noDataFound: true
            })
            console.log('Error:::::',e);
        }
    }

    checkUserInfo = async (url) => {
        const token = await AsyncStorage.getItem('token')
        await axios.post(`${BASE_URL}${JUST_USER_VERIFY}`, {
            img_url: url,
        }, {
            headers: { Authorization: token }
        }).then(response => {
            console.log("RES:::", response)
            if (response.data.status === 0) {
                this.setState({
                    isImgLoading: false,
                    noDataFound: true,
                    isModal: false
                })
                return
            }
            this.setState({
                result: response.data.result.customer,
                isImgLoading: false,
                noDataFound: false,
                isModal: false
            })
        }).catch(error => {
            console.log('errror', error)
            this.setState({
                isImgLoading: false,
                noDataFound: true,
                isModal: false
            })
        })
    }

    showModal = () => {
        if (this.state.isModal) {
            this.setState({isModal: false})
        } else {
            this.setState({isModal: true})
        }
    }

    render() {
        let {isModal, noOfFaces, isImgLoading, noDataFound, result} = this.state;
        return (
            <View style={styles.container}>
                <AppHeader navigation={this.props.navigation} title='Verify User' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                    icon1Color={COLORS.white}
                />
                <IonIcons name='camera' size={50} style={{alignSelf: 'center', marginTop: 30}} 
                    onPress={()=>this.setState({isModal: true})}
                />
                <View style={{width: '100%', height: 1, borderBottomColor: COLORS.black, borderBottomWidth: .5}}/>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    {
                        noDataFound ? 
                        <Text style={{alignSelf: 'center', fontFamily: 'OpenSans-Bold'}}>User not found</Text> :
                        result === '' ? null :
                        <View style={{flex: 1}}>
                            <View style={styles.infoTitleView}>
                                <Text style={styles.infoTitle}>First Name</Text>
                                <Text style={styles.infoTitle}>Last Name</Text>
                            </View>
                            <View style={styles.infoVlaueView}>
                                <Text style={styles.infoVlaue}>{result.first_name}</Text>
                                <Text style={styles.infoVlaue}>{result.last_name}</Text>
                            </View>

                            <View style={styles.infoTitleView}>
                                <Text style={styles.infoTitle}>Email</Text>
                                <Text style={styles.infoTitle}>Phone #</Text>
                            </View>
                            <View style={styles.infoVlaueView}>
                                <Text style={styles.infoVlaue}>{result.email}</Text>
                                <Text style={styles.infoVlaue}>{result.phone_number}</Text>
                            </View>

                            <View style={styles.infoTitleView}>
                                <Text style={styles.infoTitle}>Account Status</Text>
                                <Text style={styles.infoTitle}>Available Balance</Text>
                            </View>
                            <View style={styles.infoVlaueView}>
                                <Text style={styles.infoVlaue}>{result.account_status}</Text>
                                <Text style={styles.infoVlaue}>{result.wallet}</Text>
                            </View>
                        </View>
                    }
                </View>
                <Modal
                    visible={isModal}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{ width: width, height: height / 1.43, alignSelf: 'center' }}>
                            <RNCamera
                                ref={ref => {
                                    this.camera = ref;
                                }}
                                captureAudio={false}
                                style={{ flex: 1 }}
                                // faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                                type={RNCamera.Constants.Type.back}
                                // faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                                // onFacesDetected={this.onFaceDetected}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message: 'We need your permission to use your camera',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel',
                                }}>
                                {
                                    noOfFaces > 1 && (
                                        <Text style={styles.warning}>More than one face detected</Text>
                                    )
                                }
                                {/* <TouchableOpacity
                                    // disabled={noOfFaces > 1 || noOfFaces === 0 ? true : false}
                                    activeOpacity={0.5}
                                    style={styles.btnAlignment}
                                    onPress={this.takePicture}>
                                    <Icon name="camera" size={50} color="#fff" />
                                </TouchableOpacity> */}

                            </RNCamera>
                            <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.btn}
                                    onPress={()=>{
                                        this.setState({isModal: false})
                                    }}
                                    disabled={isImgLoading}
                                >
                                    <Text style={styles.btnTitle}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn}
                                    onPress={()=>this.takePicture()}
                                    disabled={isImgLoading}
                                >
                                    {
                                        isImgLoading ? 
                                        <ActivityIndicator size='small' color={COLORS.white} />:
                                        <Text style={styles.btnTitle}>Capture</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

export default VerifyUser;

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS.white},
    btnContainer: {flexDirection: 'row', height: 50, width: width, 
    justifyContent: 'space-around', marginTop: 30,  alignItems: 'center'},
    btn: {width: 100, height: 35, borderRadius: 10, backgroundColor: COLORS.themeColor, 
    justifyContent: 'center', alignItems: 'center'},
    btnTitle: {color: COLORS.white, fontFamily: 'OpenSans-Bold'},
    infoTitleView: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 30},
    infoTitle: {color: COLORS.black, fontFamily: 'OpenSans-Bold'},
    infoVlaue: {color: COLORS.black, fontFamily: 'OpenSans-Regular'},
    infoVlaueView: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}
})