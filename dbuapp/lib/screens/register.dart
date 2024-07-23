
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
//import 'dart:convert';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:mime/mime.dart';
import 'package:http_parser/http_parser.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _userIdController = TextEditingController();
  final TextEditingController _firstnameController = TextEditingController();
  final TextEditingController _lastnameController = TextEditingController();
  final TextEditingController _serialnumberController = TextEditingController();
  final TextEditingController _brandController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  //final TextEditingController _pcownerController = TextEditingController();
  final TextEditingController _phonenumberController = TextEditingController();
  String? _selectedGender; 
  String? _selectedDescription; // To store the selected value for the dropdown
  File? _imageFile;
   String? _selectedPcowner;

  CameraController? _cameraController;

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_imageFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please capture an image using the camera or select from gallery'),
          duration: const Duration(seconds: 3),
        ),
      );
      return;
    }

    final uri = Uri.parse('https://3736-196-190-91-32.ngrok-free.app/pcuser/add');
    var request = http.MultipartRequest('POST', uri);
    request.fields['address'] = _addressController.text;
    //request.fields['pcowner'] = _pcownerController.text;
    request.fields['gender'] = _selectedGender ?? '';
    request.fields['phonenumber'] = _phonenumberController.text;
    request.fields['userId'] = _userIdController.text;
    request.fields['firstname'] = _firstnameController.text;
    request.fields['lastname'] = _lastnameController.text;
    request.fields['serialnumber'] = _serialnumberController.text;
    request.fields['brand'] = _brandController.text;
    request.fields['description'] = _selectedDescription ?? '';
    request.fields['pcowner'] = _selectedPcowner ?? '';

    final mimeTypeData = lookupMimeType(_imageFile!.path, headerBytes: [0xFF, 0xD8])?.split('/');
    final file = await http.MultipartFile.fromPath(
      'image',
      _imageFile!.path,
      contentType: MediaType(mimeTypeData![0], mimeTypeData[1]),
    );

    request.files.add(file);

    try {
      final response = await request.send();
      final responseString = await response.stream.bytesToString();
      print(response.statusCode);
      print(responseString);

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Registration successful!'),
            duration: const Duration(seconds: 3),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Registration failed!'),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Unable to connect to the internet $e'),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  Future<void> _pickImageFromCamera() async {
    // Ensure that plugin services are initialized
    WidgetsFlutterBinding.ensureInitialized();

    // Retrieve the list of available cameras
    final cameras = await availableCameras();

    // Get the first camera from the list
    final firstCamera = cameras.first;

    // Initialize the camera controller
    _cameraController = CameraController(
      firstCamera,
      ResolutionPreset.high,
    );

    await _cameraController!.initialize();

    final file = await Navigator.push<XFile?>(
      context,
      MaterialPageRoute(
        builder: (context) => CameraPreviewScreen(cameraController: _cameraController!),
      ),
    );

    if (file != null) {
      setState(() {
        _imageFile = File(file.path);
      });
    }
  }

  Future<void> _pickImageFromGallery() async {
    try {
      final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          _imageFile = File(pickedFile.path);
        });
      }
    } catch (e) {
      print('Error picking image: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking image. Please try again.'),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child: Text('Register User')),
        backgroundColor: Colors.blue,
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextFormField(
                      controller: _userIdController,
                      decoration: InputDecoration(
                        labelText: 'User ID',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'User ID is required';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _firstnameController,
                      decoration: InputDecoration(
                        labelText: 'First Name',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'First Name is required';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _lastnameController,
                      decoration: InputDecoration(
                        labelText: 'Last Name',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Last Name is required';
                        }
                        return null;
                      },
                    ),
                     SizedBox(height: 10),
                    TextFormField(
                      controller: _addressController,
                      decoration: InputDecoration(
                        labelText: 'Addres',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Addres is required';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
          DropdownButtonFormField<String>(
            value: _selectedGender,
            decoration: InputDecoration(
              labelText: 'Gender',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
            ),
            items: ['Male', 'Female'].map((String gender) {
              return DropdownMenuItem<String>(
                value: gender,
                child: Text(gender),
              );
            }).toList(),
            onChanged: (newValue) {
              setState(() {
                _selectedGender = newValue;
              });
            },
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Gender is required';
              }
              return null;
            },
          ),
          SizedBox(height: 10),

                    TextFormField(
                      controller: _phonenumberController,
                      decoration: InputDecoration(
                        labelText: 'phonenumber',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'phone number is required';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _serialnumberController,
                      decoration: InputDecoration(
                        labelText: 'Serial Number',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      validator: (value) {

                        if (value == null || value.isEmpty) {
                          return 'Serial Number is required';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _brandController,
                      decoration: InputDecoration(
                        labelText: 'Brand',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Brand is required';
                        }
                        return null;
                      },
                    ),
SizedBox(height: 10),
        DropdownButtonFormField<String>(
          value: _selectedDescription,
          decoration: InputDecoration(
            labelText: 'Description',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
            ),
          ),
          items: ['Student', 'Staff', 'Guest'].map((String category) {
            return DropdownMenuItem<String>(
              value: category,
              child: Text(category),
            );
          }).toList(),
          onChanged: (newValue) {
            setState(() {
              _selectedDescription = newValue;
            });
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Description is required';
            }
            return null;
          },
        ),
        if (_selectedDescription == 'Staff') ...[
          SizedBox(height: 10),
          DropdownButtonFormField<String>(
            value: _selectedPcowner,
            decoration: InputDecoration(
              labelText: 'PC Owner',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
            ),
            items: ['DBU', 'Personal'].map((String owner) {
              return DropdownMenuItem<String>(
                value: owner,
                child: Text(owner),
              );
            }).toList(),
            onChanged: (newValue) {
              setState(() {
                _selectedPcowner = newValue;
              });
            },
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'PC Owner is required';
              }
              return null;
            },
          ),
        ],
        SizedBox(height: 10),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _imageFile != null
                            ? Image.file(
                                _imageFile!,
                                width: 100,
                                height: 100,
                                fit: BoxFit.cover,
                              )
                            : Container(
                                width: 100,
                                height: 100,
                                color: Colors.grey[300],
                                child: Icon(Icons.camera_alt, color: Colors.grey[700]),
                              ),
                        SizedBox(width: 10),
                        IconButton(
                          icon: Icon(Icons.camera_alt),
                          onPressed: _pickImageFromCamera,
                        ),
                        IconButton(
                          icon: Icon(Icons.photo_library),
                          onPressed: _pickImageFromGallery,
                        ),
                      ],
                    ),
                    SizedBox(height: 20),
             SizedBox(
  width: 200, // Set the desired width
  child: ElevatedButton(
    onPressed: _register,
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
        'Register',
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
        ),
      ),
    );
  }
}

class CameraPreviewScreen extends StatefulWidget {
  final CameraController cameraController;

  CameraPreviewScreen({required this.cameraController});

  @override
  _CameraPreviewScreenState createState() => _CameraPreviewScreenState();
}

class _CameraPreviewScreenState extends State<CameraPreviewScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Camera Preview'),
      ),
      body: Center(
        child: CameraPreview(widget.cameraController),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final XFile file = await widget.cameraController.takePicture();
          Navigator.pop(context, file);
        },
        child: Icon(Icons.camera),
      ),
    );
  }
}
