import React, { Component } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../assets/colors';
import AppHeader from '../components/header';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import CustomInput from '../components/customInput';
import VendorReceipt from './vendorReceipt';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { BASE_URL, USER_FACE_VERIFY } from '../constants';
import { connect } from 'react-redux';

Icon.loadFont()
const { width, height } = Dimensions.get('window')

class ChargeUserByFace extends Component {

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
            isModal: false,
            isImgLoading: false,
            noDataFound: false,
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
        await axios.post(`${BASE_URL}${USER_FACE_VERIFY}`, {
            img_url: url,
            amount: this.state.amount
        }, {
            headers: { Authorization: token }
        }).then(response => {
            if (response.data.status === 0) {
                this.setState({
                    isImgLoading: false,
                    noDataFound: true
                })
                return
            }
            this.setState({
                result: response.data.result,
                isImgLoading: false,
                noDataFound: false
            })
        }).catch(error => {
            console.log('errror', error)
            this.setState({
                isImgLoading: false,
                noDataFound: true
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

    calculateTax = (val) => {
        let tax = val*(this.props.user.commission/100)
        var amountWithTax = parseFloat(parseFloat(val)+parseFloat(tax)).toFixed(2)
        this.setState({
            amount: val,
            amountWithTax: amountWithTax
        })
    }

    render() {
        let {amount, amountWithTax, isModal, noOfFaces, isImgLoading, noDataFound, result} = this.state;
        return (
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <AppHeader navigation={this.props.navigation} title='Charge User' backgroundColor={COLORS.themeColor} icon1='ios-arrow-back'
                    icon1Color={COLORS.white}
                />
                <ProgressSteps activeLabelColor={COLORS.themeColor} activeStepNumColor={COLORS.themeColor} 
                completedStepIconColor={COLORS.themeColor} completedProgressBarColor={COLORS.themeColor}
                progressBarColor={COLORS.lightGray} activeStepIconBorderColor={COLORS.lightGray}
                labelFontFamily='OpenSans-Regular' labelColor={COLORS.color2} completedLabelColor={COLORS.color2}>
                    <ProgressStep label="Amount"
                        nextBtnDisabled={amount.length < 1 ? true : false}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <CustomInput hint='Enter amount' value={amount} keyboardType='numeric' maxLength={6}
                                onChange={(val) => this.calculateTax(val)} icon='call' secureTextEntry={false}
                                marginTop={50}
                            />
                            <Text style={{ alignSelf: 'flex-start', marginTop: 20, marginLeft: 35 }}>{`Transaction Tax: ${this.props.user.commission}%`}</Text>
                            {
                                amountWithTax.length > 0 && !isNaN(amountWithTax) && (
                                    <Text style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: 35 }}>{`Total: ${amountWithTax}`}</Text>
                                )
                            }
                        </View>
                    </ProgressStep>

                    <ProgressStep label="Take Picture"
                        // nextBtnDisabled={noOfFaces > 1 || noOfFaces === 0 ? true : false}
                        onNext={async () =>{
                            await this.takePicture()
                        }}
                        errors={false}
                        nextBtnText='Capture'
                    >
                        <View style={{ width: width, height: height / 1.43 }}>
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

                        </View>
                    </ProgressStep>
                    <ProgressStep label="Confirm"
                        onSubmit={() => this.setState({isModal:true})}
                    >
                        <View style={{ alignItems: 'center' }}>
                            {
                                isImgLoading ? 
                                <ActivityIndicator size='large' color={COLORS.themeColor}  /> :
                                noDataFound ? 
                                <Text style={styles.warning}>No face detected! please try again</Text> :
                                <VendorReceipt navigation={this.props.navigation} isModal={isModal} data={result} callFunction={this.showModal} />
                            }
                        </View>
                    </ProgressStep>
                </ProgressSteps>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    btnAlignment: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    warning: {
        fontSize: 20, alignSelf: 'center', marginTop: height/3, color: 'red'
    }
})

export default connect(mapStateToProps, null)(ChargeUserByFace);