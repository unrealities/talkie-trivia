import React from 'react'
import { Text, View } from 'react-native'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import UserStack from './userStack'
import AuthStack from './authStack'

export default function RootNavigation() {
  const { user } = useAuthentication()
  const name = user ? user.displayName : 'No User Logged In'

  // return user ? <UserStack /> : <AuthStack />
  return (
    <View>
      <Text>{name}</Text>
    </View>
  )
}
