import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'authmanager.dart';

class UserListScreen extends StatefulWidget {
  @override
  _UserListScreenState createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  late Future<List<User>> _futureUsers;
  late TextEditingController _searchController;
  late int _perPage;
 // late List<int> _perPageOptions;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    _perPage = 5; 
      //_perPageOptions = [5, 10, 25, 50, 100];// Default per page
    _futureUsers = fetchUsers();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _logout() async {
    final AuthManager authManager = AuthManager();
    authManager.clearToken(); // Clear token from local storage

    // Navigate to login page
    Navigator.pushReplacementNamed(context, 'home'); // Replace '/login page
  }

  Future<List<User>> fetchUsers() async {
  String url = 'http://10.18.51.50:3333/pcuser/get?perPage=$_perPage';
  if (_searchController.text.isNotEmpty) {
    url += '&search=${_searchController.text}';
  }

  final response = await http.get(Uri.parse(url));

  if (response.statusCode == 200) {
    List jsonResponse = json.decode(response.body);
    List<User> users = jsonResponse.map((user) => User.fromJson(user)).toList();

    // If search query is provided and users list is not empty
    if (_searchController.text.isNotEmpty && users.isNotEmpty) {
      // Filter users list based on search query
      users = users.where((user) => user.userId.contains(_searchController.text)).toList();
    }

    return users;
  } else {
    throw Exception('Failed to load users');
  }
}


 Future<void> deleteUser(int id) async {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text('Confirm Deletion'),
        content: Text('Are you sure you want to delete this user?'),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close the alert dialog
            },
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              final response = await http.delete(Uri.parse('http://10.18.51.50:3333/pcuser/delete/$id'));

              if (response.statusCode == 200) {
                setState(() {
                  _futureUsers = fetchUsers();
                });
                Navigator.of(context).pop(); // Close the alert dialog
              } else {
                throw Exception('Failed to delete user');
              }
            },
            child: Text('Delete'),
          ),
        ],
      );
    },
  );
}



  Future<void> updateUser(String userId) async {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => UserUpdateScreen(userId: userId)),
    ).then((_) {
      setState(() {
        _futureUsers = fetchUsers();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child: Text('Users detail')),
        backgroundColor: Colors.blue,
        titleTextStyle:TextStyle(color: Colors.white),
        actions: [
          PopupMenuButton(
            onSelected: (value) {
              // Handle menu item selection
              if (value == 'logout') {
                _logout(); // Call logout function when 'logout' is selected
              }
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(
                value: 'logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      body: Center(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  labelText: 'Search by User Id',
                  suffixIcon: IconButton(
                    icon: Icon(Icons.search),
                    onPressed: () {
                      setState(() {
                        _futureUsers = fetchUsers();
                      });
                    },
                  ),
                ),
              ),
            ),
            // SizedBox(width: 10),
            //       DropdownButton<int>(
            //         value: _perPage,
            //         onChanged: (int? newValue) {
            //           setState(() {
            //             _perPage = newValue!;
            //             _futureUsers = fetchUsers();
            //           });
            //         },
            //         items: _perPageOptions.map<DropdownMenuItem<int>>((int value) {
            //           return DropdownMenuItem<int>(
            //             value: value,
            //             child: Text('$value items per page'),
            //           );
            //         }).toList(),
            //       ),
            Expanded(
              child: FutureBuilder<List<User>>(
                future: _futureUsers,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return ListView.builder(
                      itemCount: snapshot.data!.length,
                      itemBuilder: (context, index) {
                        User user = snapshot.data![index];
                        return Card(
                          margin: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
                          child: ListTile(
                            leading: user.image.isNotEmpty
                                ? Image.network('http://10.18.51.50:3333/pcuser/${user.image}')
                                : null,
                            title: Text('${user.firstname} ${user.lastname}'),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('ID: ${user.userId}'),
                                Text('Description: ${user.description}'),
                                Text('Brand: ${user.brand}'),
                                Text('Serial Number: ${user.serialnumber}'),
                              ],
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: Icon(Icons.edit),
                                  onPressed: () => updateUser(user.userId),
                                ),
                                IconButton(
                                  icon: Icon(Icons.delete),
                                  onPressed: () => deleteUser(user.id),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  } else if (snapshot.hasError) {
                    return Text("${snapshot.error}");
                  }

                  return CircularProgressIndicator();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}


// User model adjustment
class User {
  final int id; // Adjusted to 'id'
  final String userId;
  final String firstname;
  final String lastname;
  final String description;
  final String image;
  final String brand;
  final String serialnumber;
  final String createdAT;
  final String updatedAT;

  User({
    required this.id,
    required this.userId,
    required this.firstname,
    required this.lastname,
    required this.description,
    required this.image,
    required this.brand,
    required this.serialnumber,
    required this.createdAT,
    required this.updatedAT,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'], // Adjusted to 'id'
      userId: json['userId'],
      firstname: json['firstname'],
      lastname: json['lastname'],
      description: json['description'],
      image: json['image'],
      brand: json['brand'],
      serialnumber: json['serialnumber'],
      createdAT: json['createdAT'],
      updatedAT: json['updatedAT'],
    );
  }
}

// Update User Screen adjustment
   
class UserUpdateScreen extends StatefulWidget {
  final String userId;

  UserUpdateScreen({required this.userId});

  @override
  _UserUpdateScreenState createState() => _UserUpdateScreenState();
}

class _UserUpdateScreenState extends State<UserUpdateScreen> {
  late TextEditingController _userIdController;
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _descriptionController;
  late TextEditingController _brandController;
  late TextEditingController _serialNumberController;

  @override
  void initState() {
    super.initState();
    _userIdController=TextEditingController();
    _firstNameController = TextEditingController();
    _lastNameController = TextEditingController();
    _descriptionController = TextEditingController();
    _brandController = TextEditingController();
    _serialNumberController = TextEditingController();
    fetchUserData();
  }

  @override
  void dispose() {
    _userIdController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _descriptionController.dispose();
    _brandController.dispose();
    _serialNumberController.dispose();
    super.dispose();
  }

 Future<void> fetchUserData() async {
  final response = await http.get(Uri.parse('http://10.18.51.50:3333/pcuser/search?userId=${widget.userId}'));

  if (response.statusCode == 200) {
    Map<String, dynamic> userData = json.decode(response.body);
    setState(() {
      _userIdController.text=userData['userId'];
      _firstNameController.text = userData['firstname'];
      _lastNameController.text = userData['lastname'];
      _descriptionController.text = userData['description'];
      _brandController.text = userData['brand'];
      _serialNumberController.text = userData['serialnumber'];
    });
  } else {
    throw Exception('Failed to load user data');
  }
}

  Future<void> updateUser() async {
    final Map<String, dynamic> updatedUserData = {
       'userId': _userIdController.text,
      'firstname': _firstNameController.text,
      'lastname': _lastNameController.text,
      'description': _descriptionController.text,
      'brand': _brandController.text,
      'serialnumber': _serialNumberController.text,
    };

    final response = await http.put(
      Uri.parse('http://10.18.51.50:3333/pcuser/update?userId=${widget.userId}'),
      body: json.encode(updatedUserData),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      // Successfully updated
      Navigator.pop(context);
    } else {
      throw Exception('Failed to update user');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Update User'),
        backgroundColor: Colors.blue,
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                 TextField(
                  controller: _userIdController,
                  decoration: InputDecoration(labelText: 'User Id'),
                ),
                TextField(
                  controller: _firstNameController,
                  decoration: InputDecoration(labelText: 'First Name'),
                ),
                TextField(
                  controller: _lastNameController,
                  decoration: InputDecoration(labelText: 'Last Name'),
                ),
                TextField(
                  controller: _descriptionController,
                  decoration: InputDecoration(labelText: 'Description'),
                ),
                TextField(
                  controller: _brandController,
                  decoration: InputDecoration(labelText: 'Brand'),
                ),
                TextField(
                  controller: _serialNumberController,
                  decoration: InputDecoration(labelText: 'Serial Number'),
                ),
                SizedBox(height: 16),
               SizedBox(
                width: 200, 
                 child: ElevatedButton(
                   onPressed: updateUser,
                   style: ButtonStyle(
                     backgroundColor: WidgetStateProperty.all<Color>(Colors.blue),
                     shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                       RoundedRectangleBorder(
                         borderRadius: BorderRadius.circular(20.0), // Adjust the border radius as needed
                       ),
                     ),
                   ),
                   child: Center(
                     child: Text(
                       'Update',
                       style: TextStyle(
                         fontSize: 16.0, // Adjust the font size as needed
                         fontWeight: FontWeight.bold,
                         color: Colors.white,
                       ),
                     ),
                   ),
                 ),
               ),
        
              ],
            ),
          ),
        ),
      ),
    );
  }
  
}
