import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(const FuelAttendantApp());
}

class FuelAttendantApp extends StatelessWidget {
  const FuelAttendantApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fuel Attendant',
      theme: ThemeData.dark(),
      home: const SplashScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
