//
//  RNSystemIcon.swift
//  WUAU
//
//  Created by Leigh Scholten on 25/5/2026.
//

import UIKit

@objc(RNSystemIcon)
class RNSystemIcon: RCTViewManager {

  override func view() -> UIView! {
    return RNSystemIconView()
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

class RNSystemIconView: UIView {

  private var imageView: UIImageView = {
    let iv = UIImageView()
    iv.contentMode = .scaleAspectFit
    iv.translatesAutoresizingMaskIntoConstraints = false
    return iv
  }()

  override init(frame: CGRect) {
    super.init(frame: frame)
    addSubview(imageView)
    NSLayoutConstraint.activate([
      imageView.topAnchor.constraint(equalTo: topAnchor),
      imageView.bottomAnchor.constraint(equalTo: bottomAnchor),
      imageView.leadingAnchor.constraint(equalTo: leadingAnchor),
      imageView.trailingAnchor.constraint(equalTo: trailingAnchor),
    ])
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  @objc var name: String = "star" {
    didSet { updateIcon() }
  }

  @objc var color: String = "#000000" {
    didSet { updateIcon() }
  }

  @objc var size: CGFloat = 24 {
    didSet { updateIcon() }
  }

  @objc var weight: String = "regular" {
    didSet { updateIcon() }
  }

  private func updateIcon() {
    let config = UIImage.SymbolConfiguration(
      pointSize: size,
      weight: symbolWeight(from: weight)
    )
    if let image = UIImage(systemName: name, withConfiguration: config) {
      imageView.image = image.withTintColor(uiColor(from: color), renderingMode: .alwaysOriginal)
    }
  }

  private func symbolWeight(from string: String) -> UIImage.SymbolWeight {
    switch string {
    case "ultraLight": return .ultraLight
    case "thin": return .thin
    case "light": return .light
    case "regular": return .regular
    case "medium": return .medium
    case "semibold": return .semibold
    case "bold": return .bold
    case "heavy": return .heavy
    case "black": return .black
    default: return .regular
    }
  }

  private func uiColor(from hex: String) -> UIColor {
    var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    if hexString.hasPrefix("#") { hexString.removeFirst() }
    var rgb: UInt64 = 0
    Scanner(string: hexString).scanHexInt64(&rgb)
    return UIColor(
      red: CGFloat((rgb >> 16) & 0xFF) / 255,
      green: CGFloat((rgb >> 8) & 0xFF) / 255,
      blue: CGFloat(rgb & 0xFF) / 255,
      alpha: 1.0
    )
  }
}
