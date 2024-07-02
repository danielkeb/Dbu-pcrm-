import 'dart:convert';

import 'package:dbuapp/screens/about.dart';
import 'package:dbuapp/screens/login.dart';
import 'package:dbuapp/screens/register.dart';
import 'package:dbuapp/screens/scanner.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;
  // ignore: unused_field
  double _opacity = 0.0;

  @override
  void initState() {
    super.initState();
    // Start the animation after a short delay
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        _opacity = 1.0;
      });
    });
  }

  final List<Widget> _pages = [
    HomePageContent(),
    RegisterPage(),
    const ScannerScreen(),
    const About(),
    LoginPage(),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: _pages[_currentIndex],
        bottomNavigationBar: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color.fromARGB(255, 165, 189, 214),
                Color.fromARGB(255, 100, 56, 142),
              ],
            ),
          ),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: _onTabTapped,
            selectedItemColor: Colors.white,
            unselectedItemColor: Colors.white70,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.home),
                backgroundColor: Colors.blue,
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_add),
                backgroundColor: Colors.blue,
                label: 'Add User',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.qr_code_scanner),
                backgroundColor: Colors.blue,
                label: 'Scanner',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.info),
                backgroundColor: Colors.blue,
                label: 'About',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.login),
                backgroundColor: Colors.blue,
                label: 'Login',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class HomePageContent extends StatefulWidget {
  @override
  _HomePageContentState createState() => _HomePageContentState();
}

class _HomePageContentState extends State<HomePageContent> {

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: fetchUser(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Please check your network connection or start the server.'));
        } else if (!snapshot.hasData) {
          return const Center(child: Text('No data available'));
        }

        final data = snapshot.data!;
        int dbu = data['maleStaffPersonal'] + data['femaleStaffPersonal'];
        int personal = data['maleNumberOfStaffDbu'] + data['femaleStaffDbu'];

        return Container(
          color: Colors.lightBlueAccent, // Set your desired background color here
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              SizedBox(height: 20),
              Row(
                children: [
                  Image.asset(
                    'assets/images/images.png', // Replace with your logo asset path
                    width: 60,
                    height: 60,
                  ),
                   SizedBox(width: 10),
              Text(
                'DBU PC Security Application',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.blue,
                ),
              ),
                ],
              ),
             
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2, // 2 columns
                  shrinkWrap: true, // Center the grid
                  mainAxisSpacing: 16.0,
                  crossAxisSpacing: 16.0,
                  padding: const EdgeInsets.all(16.0),
                  children: [
                    buildBox('Total PC Users', data['totalNumberOfPcuser']),
                    buildBox('Students', data['NumberOfstudent']),
                    buildBox('Total Staff', data['totalNumberOfStaff']),
                    buildBox('Total Guests', data['totalNumberOfGuest']),
                    buildBox('DBU Pc', dbu),
                    buildBox('Personal Pc', personal),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget buildBox(String title, int count) {
    return Container(
      width: 100,
      height: 100,
      margin: EdgeInsets.all(8.0),
      padding: EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.blue],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(10.0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            spreadRadius: 2,
            blurRadius: 5,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            title,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 10),
          Text(
            count.toString(),
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 20,
              color: Colors.blue,
            ),
          ),
        ],
      ),
    );
  }




  
  Future<Map<String, dynamic>> fetchUser() async {
  String url = 'https://ba9b-196-188-51-240.ngrok-free.app/pcuser/visualize';
  
  try {
    final response = await http.get(Uri.parse(url));
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load users');
    }
  } catch (e) {
    throw Exception('Please check your network connection or start the server.');
  }
}

}