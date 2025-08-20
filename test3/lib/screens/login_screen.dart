import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dashboard_screen.dart';
import 'register_screen.dart';
import '../widgets/custom_input.dart';

class AttendantLoginScreen extends StatefulWidget {
  const AttendantLoginScreen({super.key});

  @override
  State<AttendantLoginScreen> createState() => _AttendantLoginScreenState();
}

class _AttendantLoginScreenState extends State<AttendantLoginScreen> {
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> login() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final res = await http.post(
        Uri.parse('http://192.168.43.237:5000/api/attendants/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phoneController.text,
          'password': passwordController.text,
        }),
      );

      final data = jsonDecode(res.body);
      if (res.statusCode == 200) {
        final attendant = data['attendant'];
        final prefs = await SharedPreferences.getInstance();

        await prefs.setString('token', data['token']);
        await prefs.setString('attendantId', attendant['id']);
        await prefs.setString('stationName', attendant['stationName']);
        await prefs.setString('attendant', jsonEncode(attendant));

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder:
                (_) => DashboardScreen(
                  attendantId: attendant['id'],
                  attendantName: attendant['name'],
                ),
          ),
        );
      } else {
        setState(() {
          error = data['msg'] ?? 'Login failed';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'An error occurred. Please try again.';
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 83, 80, 80),
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 79, 199, 236),
        title: const Text(
          'Attendant Login',
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          reverse: true,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Welcome Back',
                  style: TextStyle(
                    fontSize: 28,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 30),
                CustomInputField(label: 'Phone', controller: phoneController),
                const SizedBox(height: 15),
                CustomInputField(
                  label: 'Password',
                  controller: passwordController,
                  obscureText: true,
                ),
                const SizedBox(height: 20),
                if (error != null)
                  Text(error!, style: const TextStyle(color: Colors.redAccent)),
                const SizedBox(height: 10),
                loading
                    ? const Center(
                      child: CircularProgressIndicator(
                        color: Colors.deepPurple,
                      ),
                    )
                    : ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(
                          255,
                          133,
                          67,
                          248,
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: login,
                      child: const Text(
                        'Login',
                        style: TextStyle(
                          fontSize: 16,
                          color: Color.fromARGB(255, 248, 247, 247),
                        ),
                      ),
                    ),
                const SizedBox(height: 30),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AttendantRegisterScreen(),
                      ),
                    );
                  },
                  child: const Text(
                    'Don\'t have an account? Register',
                    style: TextStyle(color: Colors.white70),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
