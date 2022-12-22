
import * as SecureStore from 'expo-secure-store'
import uuid from 'react-native-uuid'

const userID = 'userID'

async function setUserID(id: string) {
  await SecureStore.setItemAsync(userID, id)
}

export async function getUserID() {
  let id = await SecureStore.getItemAsync(userID)
  if (id) {
    return id
  } else {
    let newUserID = uuid.v4().toString()
    setUserID(newUserID)
    return newUserID
  }
}
