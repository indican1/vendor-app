import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import { COLORS } from './assets/colors'

const SplashScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/images/indiscanlogo.png')}
        style={[styles.image]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.themeColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20
  }
});

export default SplashScreen;