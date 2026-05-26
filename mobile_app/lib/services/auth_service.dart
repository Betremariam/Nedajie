import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../config/app_config.dart';
import 'api_service.dart';

/// Authentication Service
/// 
/// Handles all authentication-related operations
class AuthService {
  final ApiService _apiService = ApiService();
  
  /// Login attendant
  Future<Map<String, dynamic>> login(String phone, String password) async {
    try {
      final response = await _apiService.post(
        '/attendants/login',
        body: {
          'phone': phone,
          'password': password,
        },
        includeAuth: false,
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200) {
        // Save token
        _apiService.setToken(data['token']);
        
        // Save to local storage
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConfig.tokenKey, data['token']);
        await prefs.setString(AppConfig.attendantIdKey, data['attendant']['id']);
        await prefs.setString(AppConfig.stationNameKey, data['attendant']['stationName']);
        await prefs.setString(AppConfig.attendantNameKey, data['attendant']['name']);
        await prefs.setString(AppConfig.attendantDataKey, jsonEncode(data['attendant']));
        
        return {
          'success': true,
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message': data['msg'] ?? 'Login failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Connection failed. Please check your network.',
      };
    }
  }
  
  /// Logout attendant
  Future<void> logout() async {
    _apiService.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
  
  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConfig.tokenKey);
    if (token != null) {
      _apiService.setToken(token);
      return true;
    }
    return false;
  }
  
  /// Get stored attendant data
  Future<Map<String, dynamic>?> getAttendantData() async {
    final prefs = await SharedPreferences.getInstance();
    final attendantJson = prefs.getString(AppConfig.attendantDataKey);
    if (attendantJson != null) {
      return jsonDecode(attendantJson);
    }
    return null;
  }
  
  /// Change password
  Future<Map<String, dynamic>> changePassword(String currentPassword, String newPassword) async {
    try {
      final response = await _apiService.post(
        '/attendants/change-password',
        body: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
        includeAuth: true,
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200) {
        // Update stored attendant data to clear mustChangePassword flag
        final prefs = await SharedPreferences.getInstance();
        final attendantJson = prefs.getString(AppConfig.attendantDataKey);
        if (attendantJson != null) {
          final attendantData = jsonDecode(attendantJson);
          attendantData['mustChangePassword'] = false;
          await prefs.setString(AppConfig.attendantDataKey, jsonEncode(attendantData));
        }
        
        return {
          'success': true,
          'message': data['msg'] ?? 'Password changed successfully',
        };
      } else {
        return {
          'success': false,
          'message': data['msg'] ?? 'Failed to change password',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Connection failed. Please check your network.',
      };
    }
  }
}
