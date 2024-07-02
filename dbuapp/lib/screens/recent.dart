import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class HomePageContent extends StatefulWidget {
  @override
  _HomePageContentState createState() => _HomePageContentState();
}

class _HomePageContentState extends State<HomePageContent> {
  List<dynamic> _userActions = [];
  List<dynamic> _displayedActions = [];
  int _currentPage = 1;
  int _pageSize = 5;
  String _sortColumn = 'createdAT';
  bool _sortAscending = true;
  String _filterKeyword = '';

  @override
  void initState() {
    super.initState();
    _fetchUserActions();
  }

 Future<void> _fetchUserActions() async {
  try {
    String url = 'https://ba9b-196-188-51-240.ngrok-free.app/pcuser/action';
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final List<dynamic> responseData = jsonDecode(response.body);
      setState(() {
        _userActions = responseData.map((item) {
          return {
            'userId': item['userId']?.toString() ?? '',
            'createdAT': _formatDate(item['createdAT']),
          };
        }).toList();
        _applyFiltersAndSorting();
      });
    } else {
      throw Exception('Failed to load user actions');
    }
  } catch (_) {
    // Catching all exceptions and handling silently
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Connection Error'),
          content: Text('Please check your network connection or start the server.'),
          actions: <Widget>[
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}



  String _formatDate(String dateStr) {
    DateTime date = DateTime.parse(dateStr);
    return DateFormat('MMMM dd, hh:mm a').format(date); // Example: June 28, 08:30 PM
  }

  void _applyFiltersAndSorting() {
    List<dynamic> filteredActions = _userActions
        .where((action) =>
            action['userId'].toString().contains(_filterKeyword) ||
            action['createdAT'].contains(_filterKeyword))
        .toList();

    filteredActions.sort((a, b) {
      int comparison;
      if (_sortColumn == 'userId') {
        comparison = a['userId'].compareTo(b['userId']);
      } else {
        comparison = a['createdAT'].compareTo(b['createdAT']);
      }
      return _sortAscending ? comparison : -comparison;
    });

    setState(() {
      _displayedActions = filteredActions
          .skip((_currentPage - 1) * _pageSize)
          .take(_pageSize)
          .toList();
    });
  }

  void _onSort(String columnName) {
    setState(() {
      if (_sortColumn == columnName) {
        _sortAscending = !_sortAscending;
      } else {
        _sortColumn = columnName;
        _sortAscending = true;
      }
      _applyFiltersAndSorting();
    });
  }

  void _onFilter(String keyword) {
    setState(() {
      _filterKeyword = keyword;
      _applyFiltersAndSorting();
    });
  }

  void _onPageChange(int page) {
    setState(() {
      _currentPage = page;
      _applyFiltersAndSorting();
    });
  }

  void _onPageSizeChange(int? newSize) {
    if (newSize != null) {
      setState(() {
        _pageSize = newSize;
        _applyFiltersAndSorting();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildFilterInput(),
        _buildPageSizeDropdown(),
        Expanded(child: _buildDataTable()), // Wrap the data table in Expanded
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
          border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(15.0)),),
        ),
        onChanged: (value) {
          _onFilter(value);
        },
      ),
    );
  }

  Widget _buildPageSizeDropdown() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: DropdownButton<int>(
        value: _pageSize,
        items: [5, 10, 25, 50].map((size) {
          return DropdownMenuItem<int>(
            value: size,
            child: Text('Show $size rows'),
          );
        }).toList(),
        onChanged: _onPageSizeChange,
      ),
    );
  }

  Widget _buildDataTable() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Container(
          child: DataTable(
            sortColumnIndex: _sortColumn == 'userId' ? 0 : 1,
            sortAscending: _sortAscending,
            columns: [
              DataColumn(
                label: Text('User ID'),
                onSort: (columnIndex, _) => _onSort('userId'),
              ),
              DataColumn(
                label: Text('Date'),
                onSort: (columnIndex, _) => _onSort('createdAT'),
              ),
            ],
            rows: _displayedActions.map((action) {
              return DataRow(
                cells: [
                  DataCell(Container(
                    width: 130, // Set the desired width
                    child: Text(action['userId']),
                  )),
                  DataCell(Container(
                    width:130,// Set the desired width
                    child: Text(action['createdAT']),
                  )),
                ],
              );
            }).toList(),
          ),
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
