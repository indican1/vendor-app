import React, { useEffect } from 'react';
import { View, Text } from 'react-native';


const Profile = ({...props}) => {
   
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Text
                onPress={()=>props.navigation.goBack()}
            >{`Hello ${JSON.stringify(props)}}`}</Text>
        </View>
    )
}

export default Profile;