import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

enum UserType { vehicle, farmer }

class FuelDispenseScreen extends StatefulWidget {
  const FuelDispenseScreen({super.key});

  @override
  State<FuelDispenseScreen> createState() => _FuelDispenseScreenState();
}

class _FuelDispenseScreenState extends State<FuelDispenseScreen> {
  bool scanned = false;
  String? scannedUserId;
  String? userName;
  double? fuelLimit;
  String? vehicleType;
  String? gasType;
  String? attendantId;
  bool loading = false;
  final fuelAmountController = TextEditingController();
  String? error;
  UserType? userType;

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

    _fetchUserInfo(scannedText);
  }

  Future<void> _fetchUserInfo(String id) async {
    setState(() {
      loading = true;
      error = null;
    });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    try {
      final vehicleRes = await http.get(
        Uri.parse('http://192.168.43.237:5000/api/attendants/vehicle/$id'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (vehicleRes.statusCode == 200) {
        final data = jsonDecode(vehicleRes.body);
        setState(() {
          userType = UserType.vehicle;
          userName = data['name'];
          fuelLimit = data['fuelLimit']?.toDouble();
          vehicleType = data['vehicleType'];
          gasType = data['gasType']; // Now uses backend-determined gas type
        });
        return;
      }

      final farmerRes = await http.get(
        Uri.parse('http://192.168.43.237:5000/api/farmers/$id'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (farmerRes.statusCode == 200) {
        final data = jsonDecode(farmerRes.body);
        if (!data['isEligible']) {
          setState(() {
            error = 'Farmer not eligible (15-day wait)';
            scanned = false;
            scannedUserId = null;
          });
          return;
        }

        setState(() {
          userType = UserType.farmer;
          userName = data['farmer']['name'];
          gasType = 'benzene';
          fuelLimit = 50.0;
        });
      } else {
        throw Exception('Unknown QR or not eligible');
      }
    } catch (e) {
      setState(() {
        error = 'Error: ${e.toString()}';
        scanned = false;
        scannedUserId = null;
      });
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> _dispenseFuel() async {
    setState(() {
      loading = true;
      error = null;
    });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null || scannedUserId == null || attendantId == null) {
      setState(() {
        error = 'Missing authentication or user info';
        loading = false;
      });
      return;
    }

    try {
      if (userType == UserType.vehicle) {
        if (fuelAmountController.text.isEmpty) {
          setState(() {
            error = 'Please enter fuel amount';
            loading = false;
          });
          return;
        }

        final liters = double.tryParse(fuelAmountController.text);
        if (liters == null || liters <= 0) {
          setState(() {
            error = 'Enter valid fuel amount';
            loading = false;
          });
          return;
        }

        final response = await http.post(
          Uri.parse('http://192.168.43.237:5000/api/attendants/dispense'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'userId': scannedUserId,
            'userType': 'vehicle',
            'liters': liters,
            'fuelAttendantId': attendantId,
            'gasType': gasType,
          }),
        );

        final data = jsonDecode(response.body);
        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Fuel dispensed to vehicle')),
          );
          _resetScan(); // Reset after success
        } else {
          throw Exception(data['message'] ?? 'Failed to dispense to vehicle');
        }
      } else if (userType == UserType.farmer) {
        final liters = 50.0;

        final response = await http.post(
          Uri.parse('http://192.168.43.237:5000/api/attendants/dispense'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'userId': scannedUserId,
            'userType': 'farmer',
            'liters': liters,
            'fuelAttendantId': attendantId,
            'gasType': gasType,
          }),
        );

        final data = jsonDecode(response.body);

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('50L dispensed to farmer')),
          );
          _resetScan();
        } else {
          throw Exception(data['message'] ?? 'Failed to dispense to farmer');
        }
      }
    } catch (e) {
      setState(() => error = 'Error: ${e.toString()}');
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed: ${e.toString()}')));
    } finally {
      setState(() => loading = false);
    }
  }

  void _resetScan() {
    setState(() {
      scanned = false;
      scannedUserId = null;
      userName = null;
      fuelLimit = null;
      vehicleType = null;
      gasType = null;
      userType = null;
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
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: const Text('Fuel Dispense'),
        actions: [
          if (scanned)
            IconButton(icon: const Icon(Icons.refresh), onPressed: _resetScan),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: scannedUserId == null ? _buildScanner() : _buildDispenseForm(),
      ),
    );
  }

  Widget _buildScanner() {
    final MobileScannerController controller = MobileScannerController();

    return Column(
      children: [
        const Text(
          'Scan QR Code',
          style: TextStyle(fontSize: 18, color: Colors.white),
        ),
        const SizedBox(height: 20),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.deepPurple, width: 4),
                borderRadius: BorderRadius.circular(16),
              ),
              child: MobileScanner(
                controller: controller,
                onDetect: (BarcodeCapture capture) {
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
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDispenseForm() {
    return ListView(
      children: [
        Text(
          '${userType == UserType.farmer ? 'Farmer' : 'Vehicle'}: $userName',
          style: const TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        if (userType == UserType.vehicle) ...[
          Text(
            'Vehicle Type: $vehicleType',
            style: const TextStyle(color: Colors.white70, fontSize: 16),
          ),
          const SizedBox(height: 4),
        ],
        Text(
          'Gas Type: $gasType',
          style: const TextStyle(color: Colors.white70, fontSize: 16),
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.deepPurple.withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.deepPurple.withOpacity(0.5)),
          ),
          child: Text(
            'Daily Limit Remaining: ${fuelLimit?.toStringAsFixed(2) ?? "0"} Liters',
            style: const TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.w600),
          ),
        ),
        const SizedBox(height: 20),
        if (userType == UserType.vehicle)
          TextField(
            controller: fuelAmountController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: 'Dispense Amount (Liters)',
              labelStyle: const TextStyle(color: Colors.white70),
              hintText: 'Enter amount',
              hintStyle: const TextStyle(color: Colors.white54),
              filled: true,
              fillColor: const Color(0xFF1E1E1E),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            style: const TextStyle(color: Colors.white),
          ),
        if (error != null)
          Padding(
            padding: const EdgeInsets.only(top: 12.0),
            child: Text(
              error!,
              style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold),
            ),
          ),
        const SizedBox(height: 20),
        loading
            ? const Center(child: CircularProgressIndicator())
            : Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ElevatedButton(
                  onPressed: _dispenseFuel,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('DISPENSE FUEL', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 10),
                OutlinedButton(
                  onPressed: _resetScan,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.deepPurple,
                    side: const BorderSide(color: Colors.deepPurple),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('SCAN ANOTHER'),
                ),
              ],
            ),
      ],
    );
  }
}
