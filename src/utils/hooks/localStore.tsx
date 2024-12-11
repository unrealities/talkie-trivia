import AsyncStorage from "@react-native-async-storage/async-storage"
import uuid from "react-native-uuid"

const userIDKey = "userID"
const userNameKey = "userName"

export async function setUserID(id: string) {
  await AsyncStorage.setItem(userIDKey, id)
}

export async function getUserID(): Promise<string> {
  let id = await AsyncStorage.getItem(userIDKey)
  if (!id) {
    id = uuid.v4().toString()
    await setUserID(id)
  }
  return id
}

export async function setUserName(name: string) {
  // Only set the name in local storage if it's different from the current name
  const currentName = await getUserName()
  if (currentName !== name) {
    await AsyncStorage.setItem(userNameKey, name)
  }
}

export async function getUserName(): Promise<string> {
  let name = await AsyncStorage.getItem(userNameKey)
  if (!name) {
    name = "Guest" // Default name if not found
    await setUserName(name)
  }
  return name
}
