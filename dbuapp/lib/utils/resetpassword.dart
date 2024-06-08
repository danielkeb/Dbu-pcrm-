import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../screens/login.dart';// Assuming this is where your LoginPage is located

class ResetPassword extends StatefulWidget {
  final String id;

  ResetPassword({required this.id});

  @override
  State<ResetPassword> createState() => _ResetPasswordState();
}

class _ResetPasswordState extends State<ResetPassword> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _password1 = TextEditingController();
  final TextEditingController _password2 = TextEditingController();

  Future<void> _resetPassword(BuildContext context) async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    try {
      final response = await http.patch(
        Uri.parse('http://10.18.51.23:3333/verify/updatePassword/${widget.id}'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'password': _password1.text.trim(),
        }),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Password reset successfully'),
            duration: const Duration(seconds: 3),
          ),
        );

        // Navigate to the login page
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(
            builder: (context) => LoginPage(), // Replace with your LoginPage widget
          ),
          (route) => false, // Prevents user from going back to previous screens
        );
      } else if (response.statusCode == 403) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Reset password failed: Forbidden'),
            duration: const Duration(seconds: 3),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${response.statusCode}'),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('check your network connection'),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Reset Password'),
      backgroundColor: Colors.blue,
      ),
      body: Center(
        child: Form(
          key: _formKey,
          
          child: Padding(
            padding: EdgeInsets.all(20),
            
            child: Column(
              children: <Widget>[
                Container(
                  width: 200,
                  child: TextFormField(
                  controller: _password1,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Enter new password',
                  ),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty || value.length < 6) {
                      return 'Please enter a valid password';
                    }
                    return null;
                  },
                ),
                ),
                
                SizedBox(height: 10),
                Container(
                  width: 200,
                  child: TextFormField(
                    controller: _password2,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Confirm password',
                    ),
                    obscureText: true,
                    validator: (value) {
                      if (value!= _password1.text) {
                        return 'Passwords do not match';
                      }
                      return null;
                    },
                  ),
                ),
                SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () => _resetPassword(context),
                  child: Text('update'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}