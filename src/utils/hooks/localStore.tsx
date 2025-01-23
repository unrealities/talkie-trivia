import AsyncStorage from "@react-native-async-storage/async-storage"
import uuid from "react-native-uuid"

const userIDKey = "userID"
const userNameKey = "userName"

export async function setUserID(id: string) {
  await AsyncStorage.setItem(userIDKey, id)
}

export async function getUserID(): Promise<string> {
  console.log("getUserID: Called") // New log
  let id = await AsyncStorage.getItem(userIDKey)
  console.log("getUserID: Fetched ID from AsyncStorage:", id) // New log
  if (!id) {
    id = uuid.v4().toString()
    console.log("getUserID: Generating new ID:", id) // New log
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
  console.log("getUserName: Called") // New log
  let name = await AsyncStorage.getItem(userNameKey)
  console.log("getUserName: Fetched name from AsyncStorage:", name) // New log
  if (!name) {
    name = "Guest"
    console.log("getUserName: Setting default name:", name) // New log
    await setUserName(name)
  }
  return name
}
