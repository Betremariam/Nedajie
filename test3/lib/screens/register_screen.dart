import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'login_screen.dart';
import '../widgets/custom_input.dart';

class AttendantRegisterScreen extends StatefulWidget {
  const AttendantRegisterScreen({super.key});

  @override
  State<AttendantRegisterScreen> createState() =>
      _AttendantRegisterScreenState();
}

class _AttendantRegisterScreenState extends State<AttendantRegisterScreen> {
  final nameController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final stationNameController = TextEditingController();
  final cityController = TextEditingController();

  bool loading = false;
  String? error;
  File? pickedDocument;

  Future<void> pickDocument() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.camera);
    if (picked != null) {
      setState(() {
        pickedDocument = File(picked.path);
      });
    }
  }

  Future<void> register() async {
    if (pickedDocument == null) {
      setState(() {
        error = 'Please capture a document/image.';
      });
      return;
    }

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final uri = Uri.parse(
        'http://192.168.43.237:5000/api/attendants/register',
      );

      var request = http.MultipartRequest('POST', uri);
      request.fields['name'] = nameController.text;
      request.fields['phone'] = phoneController.text;
      request.fields['password'] = passwordController.text;
      request.fields['stationName'] = stationNameController.text;
      request.fields['city'] = cityController.text;
      request.files.add(
        await http.MultipartFile.fromPath('document', pickedDocument!.path),
      );

      final response = await request.send();
      final resBody = await response.stream.bytesToString();
      final data = jsonDecode(resBody);

      if (response.statusCode == 201) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const AttendantLoginScreen()),
        );
      } else {
        setState(() {
          error = data['msg'] ?? 'Registration failed';
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
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: const Text('Attendant Register'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView(
          children: [
            const Text(
              'Create Account',
              style: TextStyle(
                fontSize: 26,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 25),
            CustomInputField(label: 'Name', controller: nameController),
            const SizedBox(height: 15),
            CustomInputField(label: 'Phone', controller: phoneController),
            const SizedBox(height: 15),
            CustomInputField(
              label: 'Password',
              controller: passwordController,
              obscureText: true,
            ),
            const SizedBox(height: 15),
            CustomInputField(
              label: 'Station Name',
              controller: stationNameController,
            ),
            const SizedBox(height: 15),
            CustomInputField(label: 'city', controller: cityController),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: pickDocument,
              icon: const Icon(Icons.camera_alt),
              label: const Text('Capture Document'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurple,
              ),
            ),
            if (pickedDocument != null)
              Padding(
                padding: const EdgeInsets.only(top: 10),
                child: Image.file(pickedDocument!, height: 150),
              ),
            const SizedBox(height: 20),
            if (error != null)
              Text(error!, style: const TextStyle(color: Colors.redAccent)),
            const SizedBox(height: 10),
            loading
                ? const Center(
                  child: CircularProgressIndicator(color: Colors.deepPurple),
                )
                : ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  onPressed: register,
                  child: const Text(
                    'Register',
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}
