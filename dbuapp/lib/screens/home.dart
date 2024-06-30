
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
  List<dynamic> _userActions = [];
  int _currentPage = 1;
  int _pageSize = 10;
  String _sortColumn = 'date';
  bool _sortAscending = true;
  String _filterKeyword = '';

  @override
  void initState() {
    super.initState();
    _fetchUserActions();
  }

  Future<void> _fetchUserActions() async {
  try {
    String url = 'http://10.18.51.50:3333/pcuser/action?page=$_currentPage&pageSize=$_pageSize&sort=$_sortColumn&ascending=$_sortAscending&filter=$_filterKeyword';
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final List<dynamic> responseData = jsonDecode(response.body);
      setState(() {
        _userActions = responseData.map((item) {
          return {
            'userId': item['userId']?.toString() ?? '',
            'action': item['action'] ?? '',
            'Exit date': item['endYear'] ?? '',
          };
        }).toList();
      });
    } else {
      throw Exception('Failed to load user actions');
    }
  } catch (e) {
    print(e);
    throw Exception('Please check your network connection or start the server.');
  }
}


  void _onSort(String columnName) {
    setState(() {
      if (_sortColumn == columnName) {
        _sortAscending = !_sortAscending;
      } else {
        _sortColumn = columnName;
        _sortAscending = true;
      }
      _fetchUserActions();
    });
  }

  void _onFilter(String keyword) {
    setState(() {
      _filterKeyword = keyword;
      _fetchUserActions();
    });
  }

  void _onPageChange(int page) {
    setState(() {
      _currentPage = page;
      _fetchUserActions();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildFilterInput(),
        _buildDataTable(),
        _buildPaginationControls(),
      ],
    );
  }

  Widget _buildFilterInput() {
  return Padding(
    padding: const EdgeInsets.all(8.0),
    child: TextField(
      decoration: InputDecoration(
        labelText: 'Filter by keyword',
        border: OutlineInputBorder(),
      ),
      onChanged: (value) {
        _onFilter(value);
      },
    ),
  );
}

  Widget _buildDataTable() {
  return Expanded(
    child: SingleChildScrollView(
      child: DataTable(
        sortColumnIndex: _sortColumn == 'userId' ? 0 : _sortColumn == 'action' ? 1 : 2,
        sortAscending: _sortAscending,
        columns: [
          DataColumn(
            label: Text('User ID'),
            onSort: (columnIndex, _) => _onSort('userId'),
          ),
          DataColumn(
            label: Text('Action'),
            onSort: (columnIndex, _) => _onSort('action'),
          ),
          DataColumn(
            label: Text('Date'),
            onSort: (columnIndex, _) => _onSort('date'),
          ),
        ],
        rows: _userActions.map((action) {
          return DataRow(
            cells: [
              DataCell(Text(action['userId'])),
              DataCell(Text(action['action'])),
              DataCell(Text(action['endYear'])),
            ],
          );
        }).toList(),
      ),
    ),
  );
}


  Widget _buildPaginationControls() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: _currentPage > 1 ? () => _onPageChange(_currentPage - 1) : null,
        ),
        Text('Page $_currentPage'),
        IconButton(
          icon: Icon(Icons.arrow_forward),
          onPressed: () => _onPageChange(_currentPage + 1),
        ),
      ],
    );
  }
}
