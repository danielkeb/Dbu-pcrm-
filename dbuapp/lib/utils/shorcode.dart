import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'resetpassword.dart';

class Shortcode extends StatefulWidget {
  final String userId;

  Shortcode({required this.userId});

  @override
  State<Shortcode> createState() => _ShortcodeState();
}

class _ShortcodeState extends State<Shortcode> {
  dynamic _shortcodeVerificationResponse;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _codeController = TextEditingController();

  Future<void> _verifyShortcode() async {
    if (!_formKey.currentState!.validate()) return;
    final code = _codeController.text.trim();
    try {
      final response = await _makeVerifyShortcodeRequest(code, widget.userId);
      _handleSuccessResponse(response);
    } catch (e) {
      _handleError(e.toString());
    }
  }

  Future<http.Response> _makeVerifyShortcodeRequest(String code, String userId) async {
    final uri = _createUri(userId);
    final headers = _createHeaders();
    final body = _createRequestBody(code);

    return await http.post(uri, headers: headers, body: body);
  }

  Uri _createUri(String userId) {
    return Uri.parse('https://ba9b-196-188-51-240.ngrok-free.app/verify/shortcode?id=$userId');
  }

  Map<String, String> _createHeaders() {
    return <String, String>{
      'Content-Type': 'application/json',
    };
  }

  String _createRequestBody(String code) {
    return jsonEncode(<String, String>{
      'shortcode': code,
    });
  }

  void _handleSuccessResponse(http.Response response) {
    setState(() {
      _shortcodeVerificationResponse = jsonDecode(response.body);
    });
  }

  void _handleError(String error) {
    _showErrorSnackBar('Error: $error');
    setState(() {
      _shortcodeVerificationResponse = null;
    });
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Widget _buildForm() {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          Container(
            width: 200,
            child: TextFormField(
              controller: _codeController,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Enter shortcode',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter the shortcode';
                }
                return null;
              },
            ),
          ),
          SizedBox(height: 10),
          ElevatedButton(
            onPressed: _verifyShortcode,
            child: Text('Verify'),
          ),
        ],
      ),
    );
  }

  Widget _buildVerificationResult() {
    if (_shortcodeVerificationResponse != null) {
      final statusCode = _shortcodeVerificationResponse['statusCode'];
      if (statusCode == 200) {
        return TextButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ResetPassword(id: widget.userId),
              ),
            );
          },
          child: Text('Reset Password'),
        );
      } else {
        // Provide more context about the error
        return Text('Verification failed: ${_shortcodeVerificationResponse['message']}');
      }
    } else {
      return Container(); // Return empty container if response is null
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Short code verification'),
        backgroundColor: Colors.blue,
      ),
      body: Center(
        child: Container(
          width: 400,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildForm(),
              _buildVerificationResult(),
            ],
          ),
        ),
      ),
    );
  }
}
