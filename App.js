import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import Login from "./src/user/login";
import PinCode from "./src/user/pinCode";
import Home from "./src/home/home";
import SideMenu from "./src/drawer/drawer";
import Profile from "./src/drawer/profile";
import AddCash from "./src/home/addCash";
import AddCardDtl from "./src/home/addCardDtl";
import LocateVendors from "./src/home/locateVendors";
import SednCash from "./src/home/sendCash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL, CURRENT_USER, LOADER_DATA } from "./src/constants";
import { setUser } from './src/redux/action/action';
import CustomLoader from "./src/components/customLoader";
import LandingScreen from "./src/landingScreen";
import Register from "./src/user/register";
import Receipt from "./src/home/receipt";
import ChargeUserOptions from "./src/vendor/chargeUserOptions";
import ChargeUserByPhone from "./src/vendor/chargeUserbyPhone";
import ChargeUserbyFace from "./src/vendor/charegeUserbyFace";
import TransactionHistory from "./src/home/transactionHistory";
import ForgotPin from "./src/user/forgotPin";
import WidthDrawAmount from "./src/vendor/widthDraw";
import SplashScreen from "./src/splashScreen";

const Stack = createStackNavigator();

const verticalAnimation = {
  gestureDirection: 'vertical',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  },
};

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName='login'
      screenOptions = {{
        verticalAnimation,
        headerShown: false
      }}
    >
  
      <Stack.Screen
        name='login'
        component={Login}
      />
      <Stack.Screen
        name='pin'
        component={PinCode}
      />
      <Stack.Screen 
        name='register'
        component={Register}
      />
      <Stack.Screen 
        name='forgotPin'
        component={ForgotPin}
      />
          <Stack.Screen 
        name='landingScreen'
        component={LandingScreen}
      />
    </Stack.Navigator>
  )
}

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName='home'
      screenOptions={{
        verticalAnimation,
        headerShown: false
      }}
    >
      <Stack.Screen
        name='home'
        component={Home}
      />
      <Stack.Screen
        name='addCash'
        component={AddCash}
      />
      <Stack.Screen
        name='addCard'
        component={AddCardDtl}
      />
      <Stack.Screen
        name='locateVendors'
        component={LocateVendors}
      />
      <Stack.Screen
        name='sendCash'
        component={SednCash}
      />
      <Stack.Screen 
        name='receipt'
        component={Receipt}
      />
      <Stack.Screen 
        name='chargeOptions'
        component={ChargeUserOptions}
      />
      <Stack.Screen 
        name='chargeUserbyPhone'
        component={ChargeUserByPhone}
      />
      <Stack.Screen 
        name='chargeUserbyFace'
        component={ChargeUserbyFace}
      />
      <Stack.Screen 
        name='transactionHistory'
        component={TransactionHistory}
      />
      <Stack.Screen
        name='widthDraw'
        component={WidthDrawAmount}
      />
      <Stack.Screen
        name='forgotPin'
        component={ForgotPin}
      />
    </Stack.Navigator>
  )
}

const Drawer = createDrawerNavigator()

const DrawerStack = ({ props }) => {
  return (
    <Drawer.Navigator drawerPosition='left'
      drawerContent={props => <SideMenu {...props} />}
      screenOptions={{ gestureEnabled: props._id != '' ? true : false }}
    >
      {props._id != '' ? (
        <Drawer.Screen
          name="homeStack"
          component={HomeStack}
          options={{
            animationEnabled: true,
            headerShown: false
          }}
        />) : (
        <Drawer.Screen
          name="auth"
          component={AuthStack}
          options={{
            animationEnabled: true,
            headerShown: false
          }}
        />
      )}
      <Drawer.Screen
        name='profile'
        component={Profile}

      />
    </Drawer.Navigator>
  )
}

const App = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSplash, setIsSplash] = useState(true)

  const dispatch = useDispatch()

  const { userId } = useSelector(state => ({
    userId: state.userReducer.user,
  }));

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token != null) {
        axios.get(`${BASE_URL}${CURRENT_USER}`, {
          headers: { Authorization: token }
        }).then(response => {
          dispatch(setUser(response.data.user))
          setIsLoading(false)
        }).catch(error => {
          setIsLoading(false)
        })
      } else {
        setIsLoading(false)
      }
    });

    setTimeout(() => {
      setIsSplash(false)
    }, 1000);

  }, [])

  if (isSplash) {
    return (
      <SplashScreen navigation={navigation} />
    )
  }

  if (isLoading && !isSplash) {
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <CustomLoader data={LOADER_DATA} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <DrawerStack props={userId} navigation={navigation} />
    </NavigationContainer>
  )
}

export default App;