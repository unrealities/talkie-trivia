import React, { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { GoogleAuthProvider, getAuth, signInWithCredential, signOut, User } from "firebase/auth"
import * as Google from 'expo-auth-session/providers/google'
import Constants from 'expo-constants'

import { colors } from '../styles/global'
import Player from "../models/player"

interface GoogleLoginProps {
    player: Player
}

const GoogleLogin = (props: GoogleLoginProps) => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: Constants?.expoConfig?.extra?.androidClientId,
        expoClientId: Constants?.expoConfig?.extra?.expoClientId,
        iosClientId: Constants?.expoConfig?.extra?.iosClientId,
        webClientId: Constants?.expoConfig?.extra?.webClientId,
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
            const { id_token } = response.params
            const auth = getAuth()
            const credential = GoogleAuthProvider.credential(id_token)
            signInWithCredential(auth, credential)
        }
    }, [response])

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => {props.player.name != '' ? signOut(getAuth()) : promptAsync()}}
                style={styles.button}>
                <Text>{props.player.id} : {props.player.name}</Text>
                <Text style={styles.buttonText}>{props.player.name != '' ? 'Sign Out' : 'Sign In'}</Text>
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
