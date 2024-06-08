import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class AuthManager {
  static final AuthManager _instance = AuthManager._internal();
  factory AuthManager() => _instance;

  AuthManager._internal();

  String? _token;
  Map<String, dynamic>? _decodedToken;

  String? get token => _token;
  Map<String, dynamic>? get decodedToken => _decodedToken;

  Future<void> fetchToken() async {
    final storage = FlutterSecureStorage();
    _token = await storage.read(key: 'access_token');
    if (_token != null) {
      _decodedToken = JwtDecoder.decode(token!);
    }
  }

  void clearToken() {
    _token = null;
    _decodedToken = null;
    final storage = FlutterSecureStorage();
    storage.delete(key: 'access_token');
  }
}
