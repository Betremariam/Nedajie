/// Application Configuration
/// 
/// General app configuration and constants
class AppConfig {
  // App Information
  static const String appName = 'Fuel Attendant';
  static const String appVersion = '1.0.0';
  
  // Storage Keys
  static const String tokenKey = 'token';
  static const String attendantIdKey = 'attendantId';
  static const String stationNameKey = 'stationName';
  static const String attendantNameKey = 'attendantName';
  static const String attendantDataKey = 'attendant';
  
  // UI Configuration
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 12.0;
  
  // Validation
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 50;
}
