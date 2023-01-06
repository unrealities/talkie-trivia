import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

const userID = 'userID'

async function setUserID(id: string) {
  await AsyncStorage.setItem(userID, id)
}

export async function getUserID() {
  let id = await AsyncStorage.getItem(userID)
  if (id) {
    return id
  } else {
    let newUserID = uuid.v4().toString()
    setUserID(newUserID)
    return newUserID
  }
}
