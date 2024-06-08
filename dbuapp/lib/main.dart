import 'package:dbuapp/screens/home.dart';
import 'package:dbuapp/screens/scanner.dart';
import 'package:flutter/material.dart';

import 'screens/login.dart';
import 'screens/register.dart';
import 'utils/forgot.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      routes: {
        'scanner':(context)=>ScannerScreen(),
        'register':(context)=>RegisterPage(),
        'login':(context)=>LoginPage(),
        '/forgot':(context)=>ForgotPassword(),
        'home':(context)=>HomePage(),
      },
      home:HomePage(),
    );
  }

  }
   
