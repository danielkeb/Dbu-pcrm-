import 'package:dbuapp/screens/about.dart';
import 'package:dbuapp/screens/login.dart';
import 'package:dbuapp/screens/register.dart';
import 'package:dbuapp/screens/scanner.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;
  double _opacity = 0.0;

  @override
  void initState() {
    super.initState();
    // Start the animation after a short delay
    Future.delayed(Duration(seconds: 1), () {
      setState(() {
        _opacity = 1.0;
      });
    });
  }

  final List<Widget> _pages = [
    HomePageContent(),
    RegisterPage(),
    ScannerScreen(),
    About(),
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
          decoration: BoxDecoration(
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
            items: [
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
  double _opacity = 0.0;

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(seconds: 1), () {
      setState(() {
        _opacity = 1.0;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'DBU PC Security Application!',
                  style: TextStyle(
                    color: Colors.blue,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: AnimatedOpacity(
                    opacity: _opacity,
                    duration: Duration(seconds: 2),
                    child: Image.asset(
                      'assets/images/mob-re.png',
                      width: 300,
                      height: 400,
                    ),
                  ),
                ),
                
              ],
            ),
          ),
        ),
      ],
    );
  }
}
