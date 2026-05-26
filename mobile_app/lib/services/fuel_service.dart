import 'dart:convert';
import '../config/api_config.dart';
import 'api_service.dart';

/// Fuel Service
/// 
/// Handles all fuel-related operations
class FuelService {
  final ApiService _apiService = ApiService();
  
  /// Get vehicle/entity by QR code
  Future<Map<String, dynamic>> getEntityByQR(String entityId) async {
    try {
      final response = await _apiService.get('/attendants/vehicle/$entityId');
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200) {
        return {
          'success': true,
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message': data['msg'] ?? 'Entity not found',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Failed to fetch entity data',
      };
    }
  }
  
  /// Dispense fuel
  Future<Map<String, dynamic>> dispenseFuel({
    required String userId,
    required String userType,
    required double liters,
    required String gasType,
    required String fuelAttendantId,
  }) async {
    try {
      final response = await _apiService.post(
        '/attendants/dispense',
        body: {
          'userId': userId,
          'userType': userType,
          'liters': liters,
          'gasType': gasType,
          'fuelAttendantId': fuelAttendantId,
        },
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200) {
        return {
          'success': true,
          'message': data['message'] ?? 'Fuel dispensed successfully',
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to dispense fuel',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Transaction failed',
      };
    }
  }
  
  /// Get transaction history
  Future<Map<String, dynamic>> getTransactions(String stationName) async {
    try {
      final response = await _apiService.get('/attendants/transactions/$stationName');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'data': data,
        };
      } else {
        return {
          'success': false,
          'message': 'Failed to fetch transactions',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Failed to load transaction history',
      };
    }
  }
}
