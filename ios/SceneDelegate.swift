import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {

    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    guard
      let appDelegate = UIApplication.shared.delegate as? AppDelegate,
      let factory = appDelegate.reactNativeFactory
    else {
      return
    }

    let window = UIWindow(windowScene: windowScene)

    self.window = window

    // RN 0.85.x içindeki bazı kodların AppDelegate.window
    // beklemesine karşı bunu da bağlıyoruz.
    appDelegate.window = window

    factory.startReactNative(
      withModuleName: "Pasport",
      in: window,
      launchOptions: appDelegate.launchOptions
    )
  }
}
