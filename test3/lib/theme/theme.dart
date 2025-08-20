import 'package:flutter/material.dart';

final darkTheme = ThemeData.dark().copyWith(
  primaryColor: Colors.greenAccent,
  scaffoldBackgroundColor: Colors.black,
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(),
    fillColor: Colors.grey[900],
    filled: true,
  ),
);
