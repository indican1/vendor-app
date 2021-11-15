import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Modal, Dimensions,
    Image, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { Text, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from '../assets/colors';
import auth from '@react-native-firebase/auth';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { BASE_URL, CHECK_FACE, CHECK_USER, FONTS, IMAGES, SIGNUP, TOAST } from '../constants';
import axios from 'axios';
import AuthHeader from '../components/authHeader';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import Toast from 'react-native-toast-message';
import { RNCamera } from 'react-native-camera';
import storage from '@react-native-firebase/storage';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window')
Icon.loadFont()

class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phoneNo: '+1', confirm: '',
            code: '', f_name: '', l_name: '',
            email: '', pin: '',
            confirmPin: '', imageUri: '',
            isModal: false, step: 1,
            isLoading: false, takingPic: false,
            box: null, leftEyePosition: null,
            rightEyePosition: null, noOfFaces: 0,
            isCameraOpen: false,
            cameraType: 'back'
        }
    }

    signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(this.state.phoneNo);
            this.setState({ confirm: confirmation, isLoading: false })
            this.increamentStep()
        } catch (error) {
            console.log('error:::::', error)
            Toast.show({
                type: 'error',
                text1: 'Opps!',
                text2: 'Invalid phone number OR auth/too-many-requests',
                position: 'top',
                topOffset: TOAST.marginTop
            });
            this.setState({ isLoading: false })
        }
    }

    confirmCode = async () => {
        try {
            this.setState({ isLoading: true })
            await this.state.confirm.confirm(this.state.code);
            this.increamentStep()
            this.setState({ isLoading: false })
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Opps!',
                text2: 'Invalid OTP',
                position: 'top',
                topOffset: TOAST.marginTop
            });
            this.setState({ isLoading: false })
        }
    }

    // for checking phone no in data base
    checkUser = () => {
        this.setState({ isLoading: true })
        axios.post(`${BASE_URL}${CHECK_USER}`, {
            phone_number: this.state.phoneNo
        }).then(response => {
            if (response.data.status === 1) {
                this.signInWithPhoneNumber()
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Info!',
                    text2: response.data.msg,
                    position: 'top',
                    topOffset: TOAST.marginTop
                });
                this.setState({ isLoading: false })
            }
        }).catch(error => {
            console.log('errror', error)
            this.setState({ isLoading: false })
        })
    }

    takePics = async (type) => {
        if (type === 'image') {
            // this.setState({ isModal: false, isCameraOpen: false })
            ImagePicker.openPicker({
                width: 200,
                height: 200, compressImageMaxHeight: 400,
                compressImageMaxWidth: 400, includeBase64: true
            }).then((response) => {
                console.log("REPOSNE OIMAFR:::", response)
                this.setState({ imageUri: response, isCameraOpen: false, isModal: false }, () => {
                    this.uploadImageToFirebase(response.path)
                })
            })
        } else {
            this.setState({
                isCameraOpen: true, isModal: false
            })
        }
    }

    takeOnCameraPic = async () => {
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
                this.setState({ takingPic: false }, () => {
                    this.uploadImageToFirebase(data.uri)
                    const newObj = { ...data, path: data.uri, mime: 'image/jpg' }
                    this.setState({ imageUri: newObj, isCameraOpen: false })
                    console.log('NEW OBJECT::::', newObj)

                });
            } catch (err) {
                this.setState({ takingPic: false });
                Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
                return;
            }
        }
    }

    onFaceDetected = ({ faces }) => {
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

    uploadImageToFirebase = async (imgUri) => {
        this.setState({ isImgLoading: true })
        const uri = imgUri;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
            .ref(filename)
            .putFile(uploadUri);
        try {
            await task;
            storage().ref(task._ref.path).getDownloadURL().then((url) => {
                this.checkUserPic(url)
            })
        } catch (e) {
            console.log("Error::::", e)
        }
    }

    // for checking profile pic in data base
    checkUserPic = async (url) => {
        await axios.post(`${BASE_URL}${CHECK_FACE}`, {
            img_url: url,
        }).then(response => {
            if (response.data.msg === 'unauthorized face') {

            } else if (response.data.msg === 'No face found please try again') {
                Toast.show({
                    type: 'error',
                    text1: 'Opps!',
                    text2: response.data.msg,
                    position: 'top',
                    topOffset: TOAST.marginTop
                });
                this.setState({
                    imageUri: ''
                })
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Opps!',
                    text2: 'This user is already exist!',
                    position: 'top',
                    topOffset: TOAST.marginTop
                });
                this.setState({
                    imageUri: ''
                })
            }
        }).catch(error => {
            console.log('errror', error)
        })
    }

    increamentStep = () => {
        this.setState({ step: this.state.step + 1 })
    }

    decreamentStep = () => {
        if (this.state.step != 1) {
            this.setState({ step: this.state.step - 1 })
        }
    }

    _registerUser = () => {
        const formdata = new FormData();
        formdata.append("phone_number", this.state.phoneNo);
        formdata.append("pin_code", this.state.pin)
        formdata.append("first_name", this.state.f_name)
        formdata.append("last_name", this.state.l_name)
        formdata.append("email", this.state.email)
        formdata.append('profile', {
            uri: this.state.imageUri.path,
            type: this.state.imageUri.mime,
            name: `${Math.random()}.${this.state.imageUri.mime.replace('image/', '',)}`,
        });
        this.setState({ isLoading: true })
        axios.post(`${BASE_URL}${SIGNUP}`, formdata).then((response) => {
            Toast.show({
                type: 'error',
                text1: 'Opps!',
                text2: response.data.msg,
                position: 'top',
                topOffset: TOAST.marginTop
            });
            this.props.navigation.goBack()
            this.setState({ isLoading: false })
        }).catch(error => {
            this.setState({ isLoading: false })
        })
    }

    step1 = () => (
        <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
            <Title style={styles.title}>Welcome</Title>
            <Text style={styles.title1}>Please enter your phone number</Text>
            <Text style={styles.title2}>We will send you 6 digits verification code</Text>
            <CustomInput hint='Enter your mobile number' value={this.state.phoneNo} keyboardType='phone-pad' maxLength={15}
                onChange={(val) => this.setState({ phoneNo: val })} icon='call' secureTextEntry={false}
                marginTop={50}
            />
            {
                this.state.isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                    <CustomButton title='Proceed' titleColor={COLORS.white} backgroundColor={COLORS.themeColor} disabled={this.state.phoneNo === '' || this.state.phoneNo.length < 11 ? true : false} callFunction={() => this.checkUser()} />
            }
            <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                By proceeding you agree to our <Text style={styles.termCondition}>Terms & Conditions</Text>
            </Text>
        </View>
    )

    step2 = () => (
        <Animatable.View animation="fadeInUpBig" style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Title style={styles.title}>
                    OTP Verification
                </Title>
                <Text style={[styles.title1, { fontSize: 14, marginTop: 5, textAlign: 'center' }]}>
                    {`Enter the OTP sent to ${this.state.phoneNo}`}
                </Text>
                <View style={{ marginTop: 80 }}>
                    <SmoothPinCodeInput
                        autoFocus={true}
                        value={this.state.code}
                        textContentType='oneTimeCode'
                        onTextChange={(val) => this.setState({ code: val })}
                        cellSize={36}
                        cellSpacing={15}
                        codeLength={6}
                        restrictToNumbers={true}
                        password
                    />
                </View>
                {this.state.isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                    <CustomButton title='Verify' titleColor={COLORS.white} backgroundColor={COLORS.themeColor} disabled={this.state.code === '' || this.state.code.length < 6 ? true : false}
                        callFunction={() => this.confirmCode()} />}
            </View>
        </Animatable.View>
    )

    step3 = () => (
        <KeyboardAwareScrollView>
            <Animatable.View animation="fadeInUpBig" style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
                <Text style={styles.title}>Welcome</Text>
                <CustomInput hint='Enter your first name' value={this.state.f_name} keyboardType='default' maxLength={10}
                    onChange={(val) => this.setState({ f_name: val })} icon='person' secureTextEntry={false}
                    marginTop={30} />

                <CustomInput hint='Enter your last name' value={this.state.l_name} keyboardType='default' maxLength={10}
                    onChange={(val) => this.setState({ l_name: val })} icon='person' secureTextEntry={false}
                    marginTop={10} />

                <CustomInput hint='Enter your email address' value={this.state.email} keyboardType='email-address' maxLength={25}
                    onChange={(val) => this.setState({ email: val })} icon='mail' secureTextEntry={false}
                    marginTop={10} />

                <CustomButton title='Proceed' backgroundColor={COLORS.themeColor} titleColor={COLORS.white}
                disabled={
                    this.state.f_name === '' || this.state.f_name.length < 3 ||
                        this.state.l_name === '' || this.state.l_name.length < 3 ||
                        this.state.email === '' || this.state.email.length < 6 ? true : faålse
                }
                    callFunction={() => this.increamentStep()}
                />

                <Text style={[styles.title, { fontSize: 10, marginTop: 5, textAlign: 'center' }]}>
                    By proceeding you agree to our <Text style={styles.termCondition}>Terms & Conditions</Text>
                </Text>
            </Animatable.View>
        </KeyboardAwareScrollView>
    )

    step4 = () => (
        <Animatable.View animation="fadeInUpBig" style={styles.container}>
            <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
                <Title style={styles.title}>
                    Create Signup PIN
                </Title>
                <Text style={styles.title1}>Please create signup pin and confirm</Text>
                <View style={{ marginTop: 30 }}>
                <Title style={styles.title1}>
                    Enter Pin
                </Title>
                    <SmoothPinCodeInput
                        value={this.state.pin}
                        textContentType='oneTimeCode'
                        onTextChange={(val) => this.setState({ pin: val })}
                        cellSize={36}
                        codeLength={6}
                        cellSpacing={15}
                        password
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                <Title style={styles.title1}>
                    Confirm Pin
                </Title>
                    <SmoothPinCodeInput
                        value={this.state.confirmPin}
                        textContentType='oneTimeCode'
                        onTextChange={(val) => this.setState({ confirmPin: val })}
                        cellSize={36}
                        codeLength={6}
                        cellSpacing={15}
                        password
                    />
                </View>
                <CustomButton title='Confirm' backgroundColor={COLORS.themeColor} titleColor={COLORS.white} disabled={this.state.pin.length < 6 || this.state.confirmPin.length < 6 ? true : false} callFunction={() => {
                    if (this.state.pin != this.state.confirmPin) {
                        Toast.show({
                            type: 'error',
                            text1: 'Opps!',
                            text2: 'Pin not matched',
                            position: 'top',
                            topOffset: TOAST.marginTop
                        });
                    } else {
                        this.increamentStep()
                    }
                }} />
            </View>
        </Animatable.View>
    )

    step5 = () => (
        <Animatable.View animation="fadeInUpBig" style={styles.container}>
            <View style={{ flex: 1, marginTop: 30, alignItems: 'center' }}>
                <Title style={styles.title}>
                    Take a photo
                </Title>
                <Text style={styles.title1}>
                    Please take a clear photo of your face
                </Text>
                <TouchableOpacity style={{ marginTop: 20,
                 backgroundColor: COLORS.lightGray, width: 120, height: 120,
                  borderRadius: 120, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => { this.setState({ isModal: true }) }}
                >
                    {
                        !this.state.imageUri ?
                            <Icon style={{ marginTop: 7, color: '#96A9C1' }} name={'camera'} size={40} /> :
                            <Image style={{ width: 100, height: 100, borderRadius: 100 }} source={{ uri: this.state.imageUri.path }} />

                    }
                    {
                        !this.state.imageUri ? 
                        <Text style={{color: '#96A9C1'}}>Take Photo</Text> : null
                    }
                </TouchableOpacity>
                {
                    this.state.isCameraOpen && (
                        <View style={{ width: width / 1.02, height: height / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <RNCamera
                                ref={ref => {
                                    this.camera = ref;
                                }}
                                captureAudio={false}
                                style={{ width: width / 1.3, height: height / 2.5 }}
                                // faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                                type={this.state.cameraType}
                                // faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                                // onFacesDetected={this.onFaceDetected}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message: 'We need your permission to use your camera',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel',
                                }}>
                                {
                                    this.state.noOfFaces > 1 && (
                                        <Text style={styles.warning}>More than one face detected</Text>
                                    )
                                }
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        // disabled={this.state.noOfFaces > 1 || this.state.noOfFaces === 0 ? true : false}
                                        activeOpacity={0.5}
                                        style={styles.btnAlignment}
                                        onPress={this.takeOnCameraPic}>
                                        <Icon name="camera" size={50} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnAlignment}
                                        onPress={() => this.changeCamera()}
                                    >
                                        <SimpleLineIcons name="refresh" size={30} color="#fff" style={{ marginLeft: 20, bottom: 10 }} />
                                    </TouchableOpacity>
                                </View>

                            </RNCamera>
                        </View>

                    )
                }

                {
                    this.state.isLoading ? <ActivityIndicator size='large' color={COLORS.themeColor} style={{ marginTop: 20 }} /> :
                        <CustomButton title='Confirm' titleColor={COLORS.white} backgroundColor={COLORS.themeColor} disabled={this.state.imageUri === '' ? true : false} callFunction={() => this._registerUser()} />
                }
            </View>
        </Animatable.View>
    )

    changeCamera = () => {
        if (this.state.cameraType === 'back') {
            this.setState({ cameraType: 'front' })
        } else {
            this.setState({
                cameraType: 'back'
            })
        }
    }

    render() {
        let { step, isModal } = this.state
        return (
            <KeyboardAwareScrollView contentInset={{top: 0 , left: 0, right: 0, bottom: 50}} style={styles.container}>
                <AuthHeader backgroundColor='transparent' navigation={this.props.navigation} 
                callFunction={this.decreamentStep} step={this.state.step} 
                introPic={step === 1 ? IMAGES.signupImg1 : 
                step === 2 ? IMAGES.signupImg2 : step === 3 ? IMAGES.signupImg3 : 
                step === 4 ? IMAGES.signupImg4 : IMAGES.signupImg5
                }
                />
                <Toast ref={(ref) => Toast.setRef(ref)} />
                {
                    step === 1 ? this.step1() : step === 2 ? this.step2() :
                        step === 3 ? this.step3() : step === 4 ? this.step4() :
                            this.step5()
                }

                <Modal
                    visible={isModal}
                    animationType='slide'
                    transparent={true}
                >
                    <View style={{ height: 150, marginTop: height / 1.3, borderTopColor: '#ccc', borderTopWidth: 1 }}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 10, }}
                            onPress={() => this.setState({ isModal: false })}
                        >
                            <Icon name='close' size={20} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.takePics('camera')
                                }}>
                                <Text style={styles.picBtnText}>Take photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginTop: 20 }}
                                onPress={() => {
                                    this.takePics('image')
                                }}
                            >
                                <Text style={styles.picBtnText}>Choose photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: COLORS.white
    },
    title: {
        fontSize: 25, color: COLORS.themeColor, fontFamily: FONTS.opneSans_SemiBold
    },
    title1: {
        fontSize: 15, color: COLORS.color1, marginTop: 10, fontFamily: FONTS.opneSans_SemiBold
    },
    title2: {
        fontSize: 10, color: COLORS.color2, marginTop: 5, fontFamily: FONTS.opneSans_SemiBold
    },
    btnAlignment: {
        alignItems: 'center',
    },
    picBtnText: { color: COLORS.themeColor, fontSize: 18, fontFamily: FONTS.openSans_Bold, fontWeight: 'bold' },
    termCondition: { color: COLORS.themeColor, fontWeight: 'bold', fontFamily: FONTS.openSans_Bold }
});

export default Register;