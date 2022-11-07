import * as React from "react"
import { Pressable, StyleSheet, Text } from "react-native"
import { GoogleAuthProvider, getAuth, signInWithCredential } from "firebase/auth"
import * as Google from 'expo-auth-session/providers/google'
import { CLIENTID_ANDROID, CLIENTID_EXPO, CLIENTID_IOS, CLIENTID_WEB } from '@env'

import { colors } from '../styles/global'
import { Player } from "../models/player"

interface IGoogleLoginProps {
    onLoginStarted: () => any
    onLoginEnded: () => any
    onLoginSucceeded: (token: string) => any
    onLoginFailed: (e: any) => any
    player: Player
}

const GoogleLogin: FC<IGoogleLoginProps> = ({ onLoginStarted, onLoginEnded, onLoginSucceeded, onLoginFailed, props }) => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: CLIENTID_ANDROID,
        expoClientId: CLIENTID_EXPO,
        iosClientId: CLIENTID_IOS,
        webClientId: CLIENTID_WEB,
        scopes: [
            'profile',
            'email',
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
    })

    React.useEffect(() => {
        if (response?.type === 'success') {
          const { id_token } = response.params;
          const auth = getAuth();
          const credential = GoogleAuthProvider.credential(id_token);
          signInWithCredential(auth, credential);
        }
      }, [response])

    return (
        <Pressable
            onPress={() => {promptAsync()}}
            style={styles.button}>
            <Text style={styles.buttonText}>{props.player.Name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 10,
        width: 300
    },
    buttonText: {
        color: colors.secondary,
        fontFamily: 'Arvo-Bold',
        textAlign: 'center'
    }
})

export default GoogleLogin
