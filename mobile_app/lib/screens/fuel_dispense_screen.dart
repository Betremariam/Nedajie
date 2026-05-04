import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

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

  static const String baseUrl = 'http://192.168.43.237:5000/api';

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
        Uri.parse('$baseUrl/attendants/entity/$id'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final data = jsonDecode(res.body);
      if (res.statusCode == 200) {
        setState(() {
          userName = data['name'];
          entityType = data['entityType'];
          quota = data['quota'];
          phone = data['phone'];
          
          // Auto-fill for cases where it's a fixed dispense or bucket
          if (entityType == 'farmer' || entityType == 'mill_house_owner') {
             // For farmers, maybe they always take their full 15-day quota?
             // But let's allow inputting amount for flexibility, capped by quota.
          }
        });
      } else {
        setState(() {
          error = data['msg'] ?? 'Invalid or unapproved QR code';
          scanned = false; // Allow re-scan on error
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
        Uri.parse('$baseUrl/attendants/dispense'),
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
        title: const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 64),
        content: const Text(
          'Fuel dispensed successfully! Transaction recorded and stock updated.',
          textAlign: TextAlign.center,
          style: TextStyle(fontWeight: FontWeight.w500),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _resetScan();
            },
            child: const Text('OK', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
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
        title: const Text('Dispensing Hub', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          if (scanned)
            IconButton(icon: const Icon(Icons.refresh_rounded), onPressed: _resetScan),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: scannedUserId == null ? _buildScanner() : _buildDispenseForm(),
      ),
    );
  }

  Widget _buildScanner() {
    return Column(
      children: [
        const Text(
          'Position QR code within the frame',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.grey),
        ),
        const SizedBox(height: 32),
        Expanded(
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
                // Scanner Overlay
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: const Color(0xFF10B981).withOpacity(0.5), width: 2),
                    borderRadius: BorderRadius.circular(32),
                  ),
                ),
                // Corner Edges
                _buildScannerCorners(),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFF3B82F6).withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.lock_rounded, color: Color(0xFF3B82F6), size: 16),
              SizedBox(width: 8),
              Text(
                'ENCRYPTED SCANNING ENABLED',
                style: TextStyle(color: Color(0xFF3B82F6), fontSize: 10, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildScannerCorners() {
     return Stack(
       children: [
         Positioned(top: 20, left: 20, child: _corner(0)),
         Positioned(top: 20, right: 20, child: _corner(1)),
         Positioned(bottom: 20, left: 20, child: _corner(2)),
         Positioned(bottom: 20, right: 20, child: _corner(3)),
       ],
     );
  }

  Widget _corner(int index) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        border: Border(
          top: index < 2 ? const BorderSide(color: Color(0xFF10B981), width: 4) : BorderSide.none,
          bottom: index >= 2 ? const BorderSide(color: Color(0xFF10B981), width: 4) : BorderSide.none,
          left: index % 2 == 0 ? const BorderSide(color: Color(0xFF10B981), width: 4) : BorderSide.none,
          right: index % 2 != 0 ? const BorderSide(color: Color(0xFF10B981), width: 4) : BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildDispenseForm() {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    
    if (loading && quota == null) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)));
    }

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // User Identity Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: const Color(0xFF10B981).withOpacity(0.1),
                  child: Icon(
                    _getEntityIcon(),
                    color: const Color(0xFF10B981),
                    size: 32,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  userName ?? 'Unknown Entity',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF0F172A)),
                ),
                Text(
                  entityType?.toUpperCase() ?? 'NONE',
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2, color: Color(0xFF10B981)),
                ),
                const SizedBox(height: 8),
                Text(
                  phone ?? '',
                  style: TextStyle(color: isDark ? Colors.grey.shade400 : Colors.grey.shade500),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 24),

          // Quota Info Box
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('REMAINING QUOTA', style: TextStyle(color: Colors.white60, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(6)),
                      child: Text(
                        (quota?['gasType'] ?? 'diesel').toUpperCase(),
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${quota?['remaining']?.toStringAsFixed(1) ?? '0.0'}',
                      style: const TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.bold, height: 1),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(bottom: 8.0, left: 4),
                      child: Text('Liters', style: TextStyle(color: Colors.white38, fontSize: 16, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                LinearProgressIndicator(
                  value: (quota?['remaining'] ?? 0) / (quota?['limit'] ?? 1),
                  backgroundColor: Colors.white12,
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
                  borderRadius: BorderRadius.circular(4),
                  minHeight: 6,
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Total Limit: ${quota?['limit']?.toStringAsFixed(0)}L', style: const TextStyle(color: Colors.white38, fontSize: 12)),
                    if (quota?['is15Day'] == true)
                      const Text('Resets every 15 days', style: TextStyle(color: Colors.white38, fontSize: 12)),
                    if (quota?['isDaily'] == true)
                      const Text('Daily Limit', style: TextStyle(color: Colors.white38, fontSize: 12)),
                    if (quota?['isBucket'] == true)
                      const Text('One-time Bucket', style: TextStyle(color: Colors.white38, fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Action Input
          Text(
            'Dispense Amount',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: isDark ? Colors.white : const Color(0xFF0F172A)),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: fuelAmountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            style: TextStyle(color: isDark ? Colors.white : const Color(0xFF0F172A), fontSize: 18, fontWeight: FontWeight.bold),
            decoration: InputDecoration(
              hintText: '0.0',
              suffixText: 'LITERS',
              suffixStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey),
              filled: true,
              fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16), 
                borderSide: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0))
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16), 
                borderSide: const BorderSide(color: Color(0xFF10B981), width: 2)
              ),
              contentPadding: const EdgeInsets.all(24),
            ),
          ),

          if (error != null) ...[
            const SizedBox(height: 16),
            Text(error!, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w600, fontSize: 13)),
          ],

          const SizedBox(height: 40),

          loading 
            ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
            : ElevatedButton(
                onPressed: _dispenseFuel,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text('AUTHORIZE & DISPENSE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
          
          const SizedBox(height: 16),
          
          TextButton(
            onPressed: _resetScan,
            child: const Text('CANCEL & DISCARD SCAN', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  IconData _getEntityIcon() {
    switch (entityType) {
      case 'vehicle': return Icons.directions_car_rounded;
      case 'farmer': return Icons.agriculture_rounded;
      case 'mill_house_owner': return Icons.factory_rounded;
      case 'other': return Icons.help_outline_rounded;
      default: return Icons.person_rounded;
    }
  }
}
