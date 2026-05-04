import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:intl/intl.dart';

class TransactionHistoryScreen extends StatefulWidget {
  final String stationName;
  const TransactionHistoryScreen({super.key, required this.stationName});

  @override
  State<TransactionHistoryScreen> createState() => _TransactionHistoryScreenState();
}

class _TransactionHistoryScreenState extends State<TransactionHistoryScreen> {
  List<dynamic> transactions = [];
  bool loading = true;
  String? error;

  static const String baseUrl = 'http://192.168.43.237:5000/api';

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  Future<void> _fetchTransactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final res = await http.get(
        Uri.parse('$baseUrl/attendants/transactions/${widget.stationName}'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (res.statusCode == 200) {
        setState(() {
          transactions = jsonDecode(res.body);
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to load transactions';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Network error';
        loading = false;
      });
    }
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
        title: Text(
          'Fueling Log',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDark ? Colors.white : const Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
          : error != null
              ? Center(child: Text(error!, style: const TextStyle(color: Colors.red)))
              : transactions.isEmpty
                  ? _buildEmptyState(isDark)
                  : RefreshIndicator(
                      onRefresh: _fetchTransactions,
                      color: const Color(0xFF10B981),
                      child: ListView.separated(
                        padding: const EdgeInsets.all(20),
                        itemCount: transactions.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final tx = transactions[index];
                          return _buildTransactionCard(tx, isDark);
                        },
                      ),
                    ),
    );
  }

  Widget _buildEmptyState(bool isDark) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.history_rounded, size: 64, color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
          const SizedBox(height: 16),
          Text(
            'No transactions yet',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.grey.shade500 : Colors.grey.shade400,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionCard(dynamic tx, bool isDark) {
    final DateTime date = DateTime.parse(tx['createdAt']);
    final String formattedDate = DateFormat('MMM dd, hh:mm a').format(date);
    
    String entityName = 'Unknown Entity';
    String details = '';
    IconData icon = Icons.local_gas_station_rounded;

    if (tx['vehicle'] != null) {
      entityName = tx['vehicle']['ownerName'] ?? 'Vehicle';
      details = tx['vehicle']['vehicleType'] ?? 'General';
      icon = Icons.directions_car_rounded;
    } else if (tx['farmer'] != null) {
      entityName = tx['farmer']['fullName'] ?? 'Farmer';
      details = 'Agricultural';
      icon = Icons.agriculture_rounded;
    } else if (tx['millHouseOwner'] != null) {
      entityName = tx['millHouseOwner']['fullName'] ?? 'Mill House';
      details = 'Industrial';
      icon = Icons.factory_rounded;
    } else if (tx['otherUser'] != null) {
      entityName = tx['otherUser']['fullName'] ?? 'Auxiliary';
      details = 'Bucket User';
      icon = Icons.person_rounded;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: const Color(0xFF10B981), size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entityName,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
                Text(
                  '$details • $formattedDate',
                  style: TextStyle(
                    fontSize: 11,
                    color: isDark ? Colors.grey.shade400 : Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${tx['litersDispensed']} L',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF10B981),
                  letterSpacing: -0.5,
                ),
              ),
              Text(
                tx['fuelType'].toString().toUpperCase(),
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.grey.shade500 : Colors.grey.shade400,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
