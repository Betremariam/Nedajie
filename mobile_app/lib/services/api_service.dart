import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

/// API Service
/// 
/// Centralized service for making HTTP requests
class ApiService {
  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();
  
  String? _token;
  
  /// Set authentication token
  void setToken(String token) {
    _token = token;
  }
  
  /// Clear authentication token
  void clearToken() {
    _token = null;
  }
  
  /// Get headers with authentication
  Map<String, String> _getHeaders({bool includeAuth = true}) {
    final headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && _token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    
    return headers;
  }
  
  /// POST request
  Future<http.Response> post(
    String endpoint, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final response = await http.post(
        url,
        headers: _getHeaders(includeAuth: includeAuth),
        body: body != null ? jsonEncode(body) : null,
      ).timeout(ApiConfig.connectionTimeout);
      
      return response;
    } catch (e) {
      rethrow;
    }
  }
  
  /// GET request
  Future<http.Response> get(
    String endpoint, {
    bool includeAuth = true,
  }) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final response = await http.get(
        url,
        headers: _getHeaders(includeAuth: includeAuth),
      ).timeout(ApiConfig.receiveTimeout);
      
      return response;
    } catch (e) {
      rethrow;
    }
  }
  
  /// PUT request
  Future<http.Response> put(
    String endpoint, {
    Map<String, dynamic>? body,
    bool includeAuth = true,
  }) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final response = await http.put(
        url,
        headers: _getHeaders(includeAuth: includeAuth),
        body: body != null ? jsonEncode(body) : null,
      ).timeout(ApiConfig.connectionTimeout);
      
      return response;
    } catch (e) {
      rethrow;
    }
  }
  
  /// DELETE request
  Future<http.Response> delete(
    String endpoint, {
    bool includeAuth = true,
  }) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final response = await http.delete(
        url,
        headers: _getHeaders(includeAuth: includeAuth),
      ).timeout(ApiConfig.connectionTimeout);
      
      return response;
    } catch (e) {
      rethrow;
    }
  }
}
