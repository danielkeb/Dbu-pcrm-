import 'dart:io';
import 'dart:convert';
import 'package:dbuapp/utils/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:dbuapp/utils/scanner_overlay_shape.dart';
import 'package:scan/scan.dart';
import 'package:vibration/vibration.dart';
import 'package:http/http.dart' as http;

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({Key? key}) : super(key: key);

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  String? _imagePath;
  final MobileScannerController _controller = MobileScannerController();
  String? _scanError;
  Map<String, dynamic>? _userInfo;
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _autoSearchController = TextEditingController();
bool isTorchOn = false;
  @override
  void initState() {
    super.initState();
    _autoSearchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _autoSearchController.removeListener(_onSearchChanged);
    _autoSearchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    final searchQuery = _autoSearchController.text;
    if (searchQuery.isNotEmpty) {
      _searchUserInfo(searchQuery);
    }
  }

  @override
  Widget build(BuildContext context) {
    // var scanArea = (MediaQuery.of(context).size.width < 400 ||
    //         MediaQuery.of(context).size.height < 400)
    //     ? 200.0
    //     : 350.0;

    return Scaffold(
      appBar: AppBar(title: Center(child: Text('Scan barcode')),backgroundColor: Colors.blue,),
      body: Stack(
        children: [
          _imagePath != null
              ? Image.file(File(_imagePath!))
              : MobileScanner(
                  controller: _controller,
                  onDetect: (capture) async {
                    if (capture.barcodes.isNotEmpty) {
                      if ((await Vibration.hasVibrator()) ?? false) {
                        Vibration.vibrate();
                      }
                      setState(() {
                        _scanError = null;
                        _autoSearchController.text = capture.barcodes.first.rawValue!;
                      });
                      _searchUserInfo(capture.barcodes.first.rawValue!);
                    } else {
                      setState(() {
                        _scanError = 'Invalid barcode';
                      });
                    }
                  },
                ),
          _imagePath == null
              ? Container(
                
                  decoration: ShapeDecoration(
                    shape: ScannerOverlayShape(
                      borderColor: CColors.purple,
                      borderRadius: 10,
                      borderLength: 30,
                      borderWidth: 10,
                      // cutOutSize: scanArea,
                      cutOutBottomOffset: 5,
                    ),
                  ),
                )
              : Container(),
          if (_scanError != null)
            Center(
              child: Text(
                _scanError!,
                style: const TextStyle(
                  color: Colors.red,
                  fontSize: 18,
                ),
              ),
            ),
          _buildTopControls(),
          _buildImageControl(),
          const SizedBox(height: 50),
          Padding(
            padding: const EdgeInsets.all(48.0),
            child: Row(
              children: [
                Expanded(child: _buildSearchInput()),
                const SizedBox(width: 20),
                Expanded(child: _buildAutoSearchInput()),
              ],
            ),
          ),
          if (_userInfo != null) _buildUserInfoAlert(),
        ],
      ),
    );
  }

  Widget _buildTopControls() {
    return Align(
      alignment: Alignment.topLeft,
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
         GestureDetector(
  onTap: () {
    setState(() {
      isTorchOn = !isTorchOn; // Toggle the torch state
      if (isTorchOn) {
        _controller.toggleTorch();
      } else {
        _controller.toggleTorch();
      }
    });
  },
  child: Container(
    padding: const EdgeInsets.all(5),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(7),
    ),
    child: Icon(
      isTorchOn ? Icons.flash_on : Icons.flash_off, // Change icon based on torch state
      color: isTorchOn ? Colors.yellow : CColors.purple, // Change color based on torch state
      size: 33,
    ),
  ),
),

            const SizedBox(width: 10),
            GestureDetector(
              onTap: () {
                _controller.switchCamera();
              },
              child: Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 109, 38, 38),
                  borderRadius: BorderRadius.circular(7),
                ),
                child: const Icon(
                  Icons.flip_camera_android,
                  color: CColors.purple,
                  size: 33,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImageControl() {
    return Align(
      alignment: Alignment.topRight,
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: GestureDetector(
          onTap: () async {
            if (_imagePath != null) {
              setState(() {
                _imagePath = null;
              });
            } else {
              final ImagePicker picker = ImagePicker();
              final XFile? file =
                  await picker.pickImage(source: ImageSource.gallery);
              if (file != null) {
                setState(() {
                  _imagePath = file.path;
                });
                String? res = await Scan.parse(_imagePath!);
                if (res == null) {
                  setState(() {
                    _scanError = 'Invalid barcode';
                  });
                } else {
                  if ((await Vibration.hasVibrator()) ?? false) {
                    Vibration.vibrate();
                  }
                  setState(() {
                    _scanError = null;
                    _autoSearchController.text = res;
                  });
                  _searchUserInfo(res);
                }
              }
            }
          },
          child: Container(
            padding: const EdgeInsets.all(5),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(7),
            ),
            child: Icon(
              _imagePath != null ? Icons.camera_alt : Icons.image,
              color: CColors.purple,
              size: 35,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSearchInput() {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _searchController,
            decoration: const InputDecoration(
              hintText: 'Search by ID',
              hintStyle: TextStyle(color: Colors.white),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.white),
              ),
              focusedBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.white),
              ),
            ),
            style: const TextStyle(color: Colors.white),
          ),
        ),
        const SizedBox(width: 20),
        ElevatedButton(
          onPressed: () {
            String searchText = _searchController.text.trim();
            _searchUserInfo(searchText);
          },
          child: const Icon(Icons.search),
        ),
      ],
    );
  }

  Widget _buildAutoSearchInput() {
    return TextField(
      controller: _autoSearchController,
      decoration: InputDecoration(
        hintText: 'Auto search',
        suffixIcon: IconButton(
          icon: const Icon(Icons.clear),
          color: Colors.black,
          onPressed: () {
            _autoSearchController.clear();
            _fetchUserInfo(null);
          },
        ),
        hintStyle: const TextStyle(color: Colors.white),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
      ),
      style: const TextStyle(color: Colors.white),
    );
  }

  Widget _buildUserInfoAlert() {
  return Center(
    child: Container(
      width: MediaQuery.of(context).size.width * 0.9, // Adjust container width
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.blue.withOpacity(0.8),
        borderRadius: BorderRadius.circular(10),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _userInfo!['image'] != null
                ? Image.network(
                    'http://10.18.51.50:3333/pcuser/${_userInfo!['image']}',
                    width: double.infinity,
                    height: 200,
                    fit: BoxFit.cover,
                  )
                : Container(
                    width: double.infinity,
                    height: 200,
                    color: Colors.grey,
                    child: const Center(
                      child: Text(
                        'No image available',
                        style: TextStyle(color: Colors.white, fontSize: 14),
                      ),
                    ),
                  ),
            const SizedBox(height: 10),
            const Text(
              'User Information',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'ID: ${_userInfo!['userId']}',
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
            const SizedBox(height: 5),
            Text(
              'Name: ${_userInfo!['firstname']} ${_userInfo!['lastname']}',
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
            const SizedBox(height: 5),
            Text(
              'PC Brand: ${_userInfo!['brand']}',
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
            const SizedBox(height: 5),
            Text(
              'Serial Number: ${_userInfo!['serialnumber']}',
              style: const TextStyle(color: Colors.white, fontSize: 16),
             ),
            // const SizedBox(height: 10),
            //   ElevatedButton(
            //         onPressed: () {
            //           Navigator.push(
            //             context,
            //             MaterialPageRoute(builder: (context) => ScannerScreen()),
            //           );
            //         },
            //         child: Center(child: Text('Next')),
            //       ),
          ],
        ),
      ),
    ),
  );
}


  Future<void> _fetchUserInfo(String? scannedId) async {
    if (scannedId == null) return;

    try {
      final response =
          await http.get(Uri.parse('http://10.18.51.50:3333/pcuser/get'));

      if (response.statusCode == 200) {
        final List<dynamic> news = json.decode(response.body);

        final user = news.firstWhere(
          (user) => user['userId'].toString() == scannedId,
          orElse: () => null,
        );

        if (user != null) {
          setState(() {
            _userInfo = user;
            _scanError = null;
          });
        } else {
          setState(() {
            _scanError = 'User not found';
          });
        }
      } else {
        setState(() {
          _scanError = 'Failed to load user data';
        });
      }
    } catch (e) {
      setState(() {
        _scanError = 'Error: ${e.toString()}';
      });
    }
  }

  Future<void> _searchUserInfo(String searchQuery) async {
    if (searchQuery.isEmpty) return;

    try {
      final response =
          await http.get(Uri.parse('http://10.18.51.50:3333/pcuser/get'));
      if (response.statusCode == 200) {
        final List<dynamic> news = json.decode(response.body);

        final user = news.firstWhere(
          (user) =>
              user['userId'].toString().toLowerCase() == searchQuery.toLowerCase(),
          orElse: () => null,
        );

        if (user != null) {
          setState(() {
            _userInfo = user;
            _scanError = null;
          });
        } else {
          setState(() {
            _scanError = 'User not found';
          });
        }
      } else {
        setState(() {
          _scanError = 'Failed to load user data';
        });
      }
    } catch (e) {
      setState(() {
        _scanError = 'Error: ${e.toString()}';
      });
    }
  }
}
