import AsyncStorage from "@react-native-async-storage/async-storage"
import uuid from "react-native-uuid"

const userIDKey = "userID"
const userNameKey = "userName"

let currentNameCache: string | null = null

export async function setUserID(id: string) {
  console.log("setUserID: Setting ID:", id)
  await AsyncStorage.setItem(userIDKey, id)
  console.log("setUserID: ID set successfully")
}

export async function getUserID(): Promise<string> {
  console.log("getUserID: Called")
  let id = await AsyncStorage.getItem(userIDKey)
  console.log("getUserID: Fetched ID from AsyncStorage:", id)

  if (!id) {
    id = uuid.v4().toString()
    console.log("getUserID: Generating new ID:", id)
    await setUserID(id)
  }
  return id
}

export async function setUserName(name: string) {
  console.log("setUserName: Called with:", name)
  if (currentNameCache === name) {
    console.log("setUserName: Name is already set, no update needed (cache)")
    return
  }

  try {
    console.log("setUserName: Setting new name:", name)
    await AsyncStorage.setItem(userNameKey, name)
    console.log("setUserName: Name set successfully")
    currentNameCache = name
  } catch (error) {
    console.error("setUserName: Error setting name", error)
  }
}

export async function getUserName(): Promise<string> {
  console.log("getUserName: Called")

  if (currentNameCache !== null) {
    console.log("getUserName: Retrieved name from cache:", currentNameCache)
    return currentNameCache
  }

  let name = await AsyncStorage.getItem(userNameKey)
  console.log("getUserName: Fetched name from AsyncStorage:", name)

  if (!name) {
    name = "Guest"
    console.log("getUserName: Setting default name:", name)
    await setUserName(name)
  }

  currentNameCache = name
  return name
}
