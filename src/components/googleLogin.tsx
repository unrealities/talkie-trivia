import * as React from "react"
import { Pressable } from "react-native"
import { GoogleAuthProvider, getAuth, signInWithCredential } from "firebase/auth"
import * as Google from 'expo-auth-session/providers/google'
import Constants from 'expo-constants'

interface IGoogleLoginProps {
    onLoginStarted: () => any
    onLoginEnded: () => any
    onLoginSucceeded: (token: string) => any
    onLoginFailed: (e: any) => any
}

const GoogleLogin: FC<IGoogleLoginProps> = ({ onLoginStarted, onLoginEnded, onLoginSucceeded, onLoginFailed }) => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: Constants.expoConfig.extra.androidClientId,
        expoClientId: Constants.expoConfig.extra.expoClientId,
        iosClientId: Constants.expoConfig.extra.iosClientId,
        webClientId: Constants.expoConfig.extra.webClientId,
        scopes: [
            'profile',
            'email',
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
    })
    const googleLogIn = async () => {
        onLoginStarted()
        const auth = getAuth()
        try {
            auth.tenantId = Constants.expoConfig.extra.tenantId
            const result = await promptAsync()
            if (!result) {
                throw new Error('failed to login')
            }
            const creds = GoogleAuthProvider.credential(result!.params.id_token)
            const res = await signInWithCredential(auth, creds)
            const token = await res.user.getIdToken()
            console.log('google login res', res, 'token', token)
            onLoginSucceeded(token)
        } catch (e: any) {
            console.error(e)
            onLoginFailed(e)
        } finally {
            onLoginEnded()
        }
    }
    return (
        <Pressable
            onPress={googleLogIn}
        />
    )
}

export default GoogleLogin
