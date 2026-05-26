import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../widgets/custom_input.dart';
import 'dashboard_screen.dart';
import 'change_password_screen.dart';

class AttendantLoginScreen extends StatefulWidget {
  const AttendantLoginScreen({super.key});

  @override
  State<AttendantLoginScreen> createState() => _AttendantLoginScreenState();
}

class _AttendantLoginScreenState extends State<AttendantLoginScreen> {
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final AuthService _authService = AuthService();
  
  bool loading = false;
  String? error;

  Future<void> login() async {
    if (phoneController.text.isEmpty || passwordController.text.isEmpty) {
      setState(() => error = 'Please fill in all fields');
      return;
    }

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final result = await _authService.login(
        phoneController.text,
        passwordController.text,
      );

      if (!mounted) return;

      if (result['success']) {
        final attendant = result['data']['attendant'];
        final mustChangePassword = attendant['mustChangePassword'] ?? false;
        
        if (mustChangePassword) {
          // Navigate to change password screen first
          final passwordChanged = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const ChangePasswordScreen(mustChange: true),
            ),
          );
          
          // If password was changed successfully, go to dashboard
          if (passwordChanged == true) {
            if (!mounted) return;
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => DashboardScreen(
                  attendantId: attendant['id'],
                  attendantName: attendant['name'],
                ),
              ),
            );
          } else {
            // If they didn't change password, stay on login screen
            setState(() {
              loading = false;
              error = 'Password change is required to continue';
            });
          }
        } else {
          // Normal login flow - go directly to dashboard
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => DashboardScreen(
                attendantId: attendant['id'],
                attendantName: attendant['name'],
              ),
            ),
          );
        }
      } else {
        setState(() {
          error = result['message'];
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'An unexpected error occurred';
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: isDark 
              ? [const Color(0xFF0F172A), const Color(0xFF020617)]
              : [const Color(0xFFF1F5F9), const Color(0xFFF8FAFC)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo & Title Header
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E293B) : Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Image.asset(
                        'assets/nedajie_logo.png',
                        width: 80,
                        height: 80,
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  Text(
                    'Welcome back',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -1,
                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Login to your attendant account',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 48),

                  // Input Fields
                  CustomInputField(
                    label: 'Phone Number', 
                    controller: phoneController,
                    prefixIcon: Icons.phone_outlined,
                  ),
                  const SizedBox(height: 16),
                  CustomInputField(
                    label: 'Password',
                    controller: passwordController,
                    obscureText: true,
                    prefixIcon: Icons.lock_outline_rounded,
                  ),

                  // Error Message
                  if (error != null) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.red.withOpacity(0.2)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: Colors.red, size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              error!, 
                              style: const TextStyle(color: Colors.red, fontSize: 13, fontWeight: FontWeight.w500)
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
                    : ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F172A),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 18),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 0,
                        ),
                        onPressed: login,
                        child: const Text(
                          'Sign In',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                  
                  const SizedBox(height: 24),
                  
                  // Contact Admin Message
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isDark ? const Color(0xFF334155) : Colors.blue.shade200,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.info_outline, 
                          color: isDark ? Colors.blue.shade300 : Colors.blue.shade700, 
                          size: 20
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'New attendants must be registered by station owners',
                            style: TextStyle(
                              color: isDark ? Colors.blue.shade300 : Colors.blue.shade700,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
