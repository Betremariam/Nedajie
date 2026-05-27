/// API Configuration
/// 
/// Centralized configuration for all API endpoints and base URLs.
/// Change the baseUrl here to update it across the entire app.
class ApiConfig {
  // Base URL - Change this for different environments
  static const String baseUrl = 'http://192.168.43.237:5000';
  
  // Alternative URLs for different environments
  // static const String baseUrl = 'http://192.168.43.237:5000'; // Network testing
  // static const String baseUrl = 'https://api.yourproduction.com'; // Production
  
  // API Endpoints
  static const String apiPrefix = '/api';
  
  // Auth endpoints
  static String get loginEndpoint => '$baseUrl$apiPrefix/attendants/login';
  
  // Vehicle endpoints
  static String get vehicleEndpoint => '$baseUrl$apiPrefix/attendants/vehicle';
  
  // Dispense endpoints
  static String get dispenseEndpoint => '$baseUrl$apiPrefix/attendants/dispense';
  
  // Transaction endpoints
  static String get transactionsEndpoint => '$baseUrl$apiPrefix/attendants/transactions';
  
  // Helper method to build full URL
  static String buildUrl(String path) {
    if (path.startsWith('http')) {
      return path;
    }
    return '$baseUrl$apiPrefix$path';
  }
  
  // Timeout configurations
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
