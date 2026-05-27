import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../config/api_config.dart';

class FuelDispenseScreen extends StatefulWidget {
  const FuelDispenseScreen({super.key});

  @override
  State<FuelDispenseScreen> createState() => _FuelDispenseScreenState();
}

class _FuelDispenseScreenState extends State<FuelDispenseScreen> {
  bool scanned = false;
  String? scannedUserId;
  String? userName;
  String? entityType;
  Map<String, dynamic>? quota;
  String? phone;
  String? attendantId;
  bool loading = false;
  final fuelAmountController = TextEditingController();
  String? error;

  @override
  void initState() {
    super.initState();
    _loadAttendantData();
  }

  Future<void> _loadAttendantData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      attendantId = prefs.getString('attendantId');
    });
  }

  void onScan(String scannedText) {
    if (scanned) return;
    setState(() {
      scanned = true;
      scannedUserId = scannedText;
    });
    _fetchEntityInfo(scannedText);
  }

  Future<void> _fetchEntityInfo(String id) async {
    setState(() {
      loading = true;
      error = null;
    });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    try {
      final res = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/attendants/entity/$id'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final data = jsonDecode(res.body);
      if (res.statusCode == 200) {
        setState(() {
          userName = data['name'];
          entityType = data['entityType'];
          quota = data['quota'];
          phone = data['phone'];
        });
      } else {
        setState(() {
          error = data['msg'] ?? 'Invalid or unapproved QR code';
          scanned = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Network error. Please try again.';
        scanned = false;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> _dispenseFuel() async {
    if (fuelAmountController.text.isEmpty) {
      setState(() => error = 'Please enter amount to dispense');
      return;
    }

    final liters = double.tryParse(fuelAmountController.text);
    if (liters == null || liters <= 0) {
      setState(() => error = 'Enter a valid positive number');
      return;
    }

    if (liters > (quota?['remaining'] ?? 0)) {
      setState(() => error = 'Amount exceeds remaining quota');
      return;
    }

    setState(() {
      loading = true;
      error = null;
    });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/attendants/dispense'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'userId': scannedUserId,
          'userType': entityType,
          'liters': liters,
          'fuelAttendantId': attendantId,
          'gasType': quota?['gasType'] ?? 'diesel',
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        if (!mounted) return;
        _showSuccessDialog();
      } else {
        setState(() => error = data['message'] ?? 'Dispense failed');
      }
    } catch (e) {
      setState(() => error = 'Connection error. Transaction aborted.');
    } finally {
      setState(() => loading = false);
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        backgroundColor: Colors.white,
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 64),
            ),
            const SizedBox(height: 24),
            const Text(
              'Success!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 12),
            const Text(
              'Fuel dispensed successfully!\nTransaction recorded and stock updated.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
          ],
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _resetScan();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0F172A),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Continue', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  void _resetScan() {
    setState(() {
      scanned = false;
      scannedUserId = null;
      userName = null;
      entityType = null;
      quota = null;
      phone = null;
      error = null;
      fuelAmountController.clear();
    });
  }

  @override
  void dispose() {
    fuelAmountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF020617) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Fuel Dispense', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
        foregroundColor: isDark ? Colors.white : const Color(0xFF0F172A),
        elevation: 0,
        actions: [
          if (scanned)
            IconButton(
              icon: const Icon(Icons.refresh_rounded),
              onPressed: _resetScan,
              tooltip: 'Scan New QR',
            ),
        ],
      ),
      body: scannedUserId == null ? _buildScanner() : _buildDispenseForm(isDark),
    );
  }

  Widget _buildScanner() {
    return Column(
      children: [
        const SizedBox(height: 24),
        const Text(
          'Position QR code within the frame',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.grey),
        ),
        const SizedBox(height: 32),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(32),
              child: Stack(
                children: [
                  MobileScanner(
                    onDetect: (capture) {
                      final List<Barcode> barcodes = capture.barcodes;
                      for (final barcode in barcodes) {
                        final String? code = barcode.rawValue;
                        if (code != null) {
                          onScan(code);
                          break;
                        }
                      }
                    },
                  ),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xFF10B981).withOpacity(0.5), width: 3),
                      borderRadius: BorderRadius.circular(32),
                    ),
                  ),
                  _buildScannerCorners(),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 32),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 24),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          decoration: BoxDecoration(
            color: const Color(0xFF3B82F6).withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF3B82F6).withOpacity(0.3)),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.lock_rounded, color: Color(0xFF3B82F6), size: 18),
              SizedBox(width: 10),
              Text(
                'ENCRYPTED SCANNING ENABLED',
                style: TextStyle(color: Color(0xFF3B82F6), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5),
              ),
            ],
          ),
        ),
        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildScannerCorners() {
    return Stack(
      children: [
        Positioned(top: 30, left: 30, child: _corner(0)),
        Positioned(top: 30, right: 30, child: _corner(1)),
        Positioned(bottom: 30, left: 30, child: _corner(2)),
        Positioned(bottom: 30, right: 30, child: _corner(3)),
      ],
    );
  }

  Widget _corner(int index) {
    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        border: Border(
          top: index < 2 ? const BorderSide(color: Color(0xFF10B981), width: 5) : BorderSide.none,
          bottom: index >= 2 ? const BorderSide(color: Color(0xFF10B981), width: 5) : BorderSide.none,
          left: index % 2 == 0 ? const BorderSide(color: Color(0xFF10B981), width: 5) : BorderSide.none,
          right: index % 2 != 0 ? const BorderSide(color: Color(0xFF10B981), width: 5) : BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildDispenseForm(bool isDark) {
    if (loading && quota == null) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: Color(0xFF10B981)),
            SizedBox(height: 16),
            Text('Loading entity information...', style: TextStyle(color: Colors.grey)),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Entity Identity Card
          Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0F172A).withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _getEntityIcon(),
                    color: const Color(0xFF10B981),
                    size: 40,
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  userName ?? 'Unknown Entity',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _getEntityLabel(entityType),
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: Color(0xFF10B981)),
                  ),
                ),
                if (phone != null) ...[
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.phone, color: Colors.white38, size: 16),
                      const SizedBox(width: 6),
                      Text(
                        phone!,
                        style: const TextStyle(color: Colors.white70, fontSize: 14),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Quota Display Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'AVAILABLE QUOTA',
                      style: TextStyle(
                        color: isDark ? Colors.white60 : Colors.grey.shade600,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getFuelColor().withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: _getFuelColor().withOpacity(0.3)),
                      ),
                      child: Text(
                        (quota?['gasType'] ?? 'diesel').toUpperCase(),
                        style: TextStyle(
                          color: _getFuelColor(),
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${quota?['remaining']?.toStringAsFixed(1) ?? '0.0'}',
                      style: TextStyle(
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                        fontSize: 52,
                        fontWeight: FontWeight.bold,
                        height: 1,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 10, left: 6),
                      child: Text(
                        'Liters',
                        style: TextStyle(
                          color: isDark ? Colors.white38 : Colors.grey.shade400,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: (quota?['remaining'] ?? 0) / (quota?['limit'] ?? 1),
                    backgroundColor: isDark ? Colors.white12 : Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(_getFuelColor()),
                    minHeight: 8,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Limit: ${quota?['limit']?.toStringAsFixed(0)}L',
                      style: TextStyle(color: isDark ? Colors.white38 : Colors.grey.shade500, fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                    Text(
                      _getQuotaType(),
                      style: TextStyle(color: isDark ? Colors.white38 : Colors.grey.shade500, fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Dispense Amount Input
          Text(
            'Dispense Amount',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: fuelAmountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            style: TextStyle(
              color: isDark ? Colors.white : const Color(0xFF0F172A),
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
            decoration: InputDecoration(
              hintText: '0.0',
              hintStyle: TextStyle(color: Colors.grey.shade400),
              suffixText: 'LITERS',
              suffixStyle: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 12,
                color: isDark ? Colors.white38 : Colors.grey.shade500,
              ),
              filled: true,
              fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0), width: 2),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: Color(0xFF10B981), width: 2),
              ),
              contentPadding: const EdgeInsets.all(20),
            ),
          ),

          if (error != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.red.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: Colors.red, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      error!,
                      style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 32),

          // Action Buttons
          loading
              ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
              : Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _dispenseFuel,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F172A),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 18),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 0,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.local_gas_station_rounded, size: 20),
                            SizedBox(width: 10),
                            Text('DISPENSE FUEL', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 0.5)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: _resetScan,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text(
                        'Cancel & Scan New QR',
                        style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                    ),
                  ],
                ),
        ],
      ),
    );
  }

  IconData _getEntityIcon() {
    switch (entityType) {
      case 'vehicle':
        return Icons.directions_car_rounded;
      case 'farmer':
        return Icons.agriculture_rounded;
      case 'mill_house_owner':
        return Icons.factory_rounded;
      case 'other':
        return Icons.business_rounded;
      default:
        return Icons.person_rounded;
    }
  }

  String _getEntityLabel(String? type) {
    switch (type) {
      case 'vehicle':
        return 'VEHICLE';
      case 'farmer':
        return 'FARMER';
      case 'mill_house_owner':
        return 'MILL HOUSE OWNER';
      case 'other':
        return 'OTHER ENTITY';
      default:
        return 'UNKNOWN';
    }
  }

  Color _getFuelColor() {
    final gasType = quota?['gasType'] ?? 'diesel';
    return gasType == 'benzene' ? const Color(0xFFEF4444) : const Color(0xFF10B981);
  }

  String _getQuotaType() {
    if (quota?['is15Day'] == true) return '15-Day Cycle';
    if (quota?['is3Day'] == true) return '3-Day Cycle';
    if (quota?['isDaily'] == true) return 'Daily Reset';
    if (quota?['isBucket'] == true) return 'One-Time Bucket';
    return 'Standard Quota';
  }
}
