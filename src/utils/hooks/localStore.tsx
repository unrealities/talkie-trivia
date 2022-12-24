import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import uuid from 'react-native-uuid'

const userID = 'userID'

async function setUserID(id: string) {
  await SecureStore.setItemAsync(userID, id)
}

export async function getUserID() {
  // SecureStore does not work for web
  if (Platform.OS === 'web') {
    return 'web-user'
  }
  let id = await SecureStore.getItemAsync(userID)
  if (id) {
    return id
  } else {
    let newUserID = uuid.v4().toString()
    setUserID(newUserID)
    return newUserID
  }
}
