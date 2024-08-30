import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

const userID = 'userID'
const userName = 'userName'

async function setUserID(id: string) {
  await AsyncStorage.setItem(userID, id)
}

export async function setUserName(name: string) {
  await AsyncStorage.setItem(userName, name)
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

export async function getUserName() {
  let name = await AsyncStorage.getItem(userName)
  if (name) {
    return name
  } else {
    let newUserName = 'Guest'
    setUserID(newUserName)
    return newUserName
  }
}
