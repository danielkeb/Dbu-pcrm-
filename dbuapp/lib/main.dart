import 'dart:async';
import 'package:flutter/material.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

import 'screens/home.dart';
import 'screens/scanner.dart';
import 'screens/login.dart';
import 'screens/register.dart';
import 'utils/forgot.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool _isConnected = true; // Assume initially connected
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;

  @override
  void initState() {
    super.initState();
    _connectivitySubscription =
        _connectivity.onConnectivityChanged.listen((results) {
      _updateConnectionStatus(results.first);
    });
    _checkConnectivity();
  }
  

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  Future<void> _checkConnectivity() async {
    var connectivityResult = await _connectivity.checkConnectivity();
    setState(() {
      _isConnected = (connectivityResult != ConnectivityResult.none);
    });
  }

  void _updateConnectionStatus(ConnectivityResult result) {
    setState(() {
      _isConnected = (result != ConnectivityResult.none);
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      routes: {
        'scanner': (context) => const ScannerScreen(),
        'register': (context) => RegisterPage(),
        'login': (context) => LoginPage(),
        '/forgot': (context) => const ForgotPassword(),
        'home': (context) => const HomePage(),
      },
      home: _isConnected ? const HomePage() : const NoNetworkPage(),
    );
  }
}

class NoNetworkPage extends StatelessWidget {
  const NoNetworkPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/nonetwork.jpg',
              width: 200,
              height: 200,
            ),
            const SizedBox(height: 20),
            const Text(
              'No Network Connection',
              style: TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Handle retry or navigate to settings
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}
