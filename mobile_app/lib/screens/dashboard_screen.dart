import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'login_screen.dart';
import 'fuel_dispense_screen.dart';
import 'dart:convert';
import 'transaction_history_screen.dart';
import 'change_password_screen.dart';

class DashboardScreen extends StatefulWidget {
  final String attendantName;
  final String attendantId;
  const DashboardScreen({
    super.key,
    required this.attendantName,
    required this.attendantId,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String stationName = 'Loading...';
  String region = '...';
  bool mustChangePassword = false;

  @override
  void initState() {
    super.initState();
    _loadAttendantData();
  }

  Future<void> _loadAttendantData() async {
    final prefs = await SharedPreferences.getInstance();
    final attendantJson = prefs.getString('attendant');
    if (attendantJson != null) {
      final data = jsonDecode(attendantJson);
      setState(() {
        stationName = data['stationName'] ?? 'Generic Station';
        region = data['region'] ?? 'Unknown Region';
        mustChangePassword = data['mustChangePassword'] ?? false;
      });
    }
  }
  
  Future<void> _navigateToChangePassword({bool mandatory = false}) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChangePasswordScreen(mustChange: mandatory),
      ),
    );
    
    // If password was changed successfully, reload attendant data
    if (result == true) {
      await _loadAttendantData();
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const AttendantLoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF020617) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        centerTitle: false,
        title: Image.asset('assets/nedajie_logo.png', height: 32),
        actions: [
          IconButton(
            icon: Icon(Icons.logout, color: isDark ? Colors.white70 : const Color(0xFF0F172A)),
            onPressed: logout,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            Text(
              'Welcome back,',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
              ),
            ),
            Text(
              widget.attendantName,
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                letterSpacing: -1,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 24),

            // Station Card
            Container(
              padding: const EdgeInsets.all(20),
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Icon(Icons.local_gas_station_rounded, color: Color(0xFF10B981), size: 32),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'ACTIVE SESSION',
                          style: TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    stationName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    region,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.6),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Divider(color: Colors.white12),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Icon(Icons.security_rounded, color: Colors.white30, size: 14),
                      SizedBox(width: 8),
                      Text(
                        'Secure Attendant Protocol v2.0',
                        style: TextStyle(color: Colors.white30, fontSize: 10, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // Quick Actions
            Text(
              'Dispensing Hub',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 16),
            
            _buildActionCard(
              context,
              title: 'Scan Fuel QR',
              subtitle: 'Verify & Dispense Unit',
              icon: Icons.qr_code_scanner_rounded,
              color: const Color(0xFF10B981), // Emerald
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => FuelDispenseScreen()),
                );
              },
            ),
            
            const SizedBox(height: 16),
            
            _buildActionCard(
              context,
              title: 'Transaction History',
              subtitle: 'Recent Fuel Dispenses',
              icon: Icons.history_rounded,
              color: const Color(0xFF3B82F6), // Blue
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => TransactionHistoryScreen(stationName: stationName)),
                );
              },
            ),
            
            const SizedBox(height: 16),
            
            _buildActionCard(
              context,
              title: 'Change Password',
              subtitle: 'Update Your Security',
              icon: Icons.lock_reset,
              color: const Color(0xFF8B5CF6), // Purple
              onTap: () => _navigateToChangePassword(mandatory: false),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? Colors.grey.shade400 : Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: isDark ? Colors.grey.shade600 : Colors.grey.shade300,
            ),
          ],
        ),
      ),
    );
  }
}
