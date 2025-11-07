pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
rootProject.name = 'pasport'

include ':app'
include ':react-native-video'
project(':react-native-video').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-video/android')
include ':react-native-vector-icons'
project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')
include ':react-native-ssl-pinning'
project(':react-native-ssl-pinning').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-ssl-pinning/android')
include ':react-native-async-storage_async-storage'
project(':react-native-async-storage_async-storage').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-async-storage/async-storage/android')
include ':react-native-config'
project(':react-native-config').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-config/android')
includeBuild('../node_modules/@react-native/gradle-plugin')