import React, { useEffect } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { GoogleAuthProvider, getAuth, signInWithCredential } from "firebase/auth"
import * as Google from 'expo-auth-session/providers/google'
import { CLIENTID_ANDROID, CLIENTID_EXPO, CLIENTID_IOS, CLIENTID_WEB } from '@env'

import { colors } from '../styles/global'
import Player from "../models/player"

interface GoogleLoginProps {
    player: Player
}

const GoogleLogin = (props: GoogleLoginProps) => {
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

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const auth = getAuth();
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
        }
    }, [response])

    return (
        <View style={styles.container}>
            <Pressable
                disabled={props.player.name != ''}
                onPress={() => { promptAsync() }}
                style={styles.button}>
                <Text style={styles.buttonText}>{props.player.name != '' ? props.player.name : 'Sign In'}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        flex: 1,
        maxHeight: 40,
        padding: 10,
        width: 280
    },
    buttonText: {
        color: colors.secondary,
        fontFamily: 'Arvo-Bold',
        textAlign: 'center'
    },
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        maxHeight: 60,
        padding: 8,
        width: 300
    }
})

export default GoogleLogin
