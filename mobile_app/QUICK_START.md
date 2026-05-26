# Quick Start Guide - Mobile App

## Changing the API Base URL

### Step 1: Open Configuration File
Open `mobile_app/lib/config/api_config.dart`

### Step 2: Update Base URL
Find this line:
```dart
static const String baseUrl = 'http://localhost:5000';
```

Change it to your desired URL:

**For localhost:**
```dart
static const String baseUrl = 'http://localhost:5000';
```

**For network testing:**
```dart
static const String baseUrl = 'http://192.168.43.237:5000';
```

**For production:**
```dart
static const String baseUrl = 'https://api.yourproduction.com';
```

### Step 3: Save and Restart
Save the file and restart your app. That's it!

## Project Structure Overview

```
mobile_app/lib/
├── config/              # 🔧 Configuration (API URLs, constants)
├── services/            # 🔌 Business logic & API calls
├── screens/             # 📱 UI screens
├── widgets/             # 🧩 Reusable components
└── theme/               # 🎨 App theme
```

## Using Services in Your Code

### Authentication
```dart
import '../services/auth_service.dart';

final AuthService _authService = AuthService();

// Login
final result = await _authService.login(phone, password);
if (result['success']) {
  // Success!
}

// Logout
await _authService.logout();
```

### Fuel Operations
```dart
import '../services/fuel_service.dart';

final FuelService _fuelService = FuelService();

// Get entity by QR
final result = await _fuelService.getEntityByQR(entityId);

// Dispense fuel
final result = await _fuelService.dispenseFuel(
  userId: userId,
  userType: userType,
  liters: liters,
  gasType: gasType,
  fuelAttendantId: attendantId,
);

// Get transactions
final result = await _fuelService.getTransactions(stationName);
```

## Response Format

All services return this format:
```dart
{
  'success': true/false,
  'data': {...},        // When success is true
  'message': '...'      // When success is false
}
```

## Example Usage

```dart
final result = await _authService.login(phone, password);

if (result['success']) {
  // Handle success
  final data = result['data'];
  print('Login successful: ${data['attendant']['name']}');
} else {
  // Handle error
  print('Error: ${result['message']}');
}
```

## Common Tasks

### Add New API Endpoint
1. Open `lib/config/api_config.dart`
2. Add your endpoint:
```dart
static String get myNewEndpoint => '$baseUrl$apiPrefix/my-endpoint';
```

### Create New Service Method
1. Open appropriate service file (or create new one)
2. Add method:
```dart
Future<Map<String, dynamic>> myNewMethod() async {
  final response = await _apiService.get('/my-endpoint');
  final data = jsonDecode(response.body);
  
  if (response.statusCode == 200) {
    return {'success': true, 'data': data};
  } else {
    return {'success': false, 'message': data['msg']};
  }
}
```

### Use in Screen
```dart
final result = await _myService.myNewMethod();
if (result['success']) {
  // Use result['data']
}
```

## Troubleshooting

### "Connection failed" error
- Check if backend server is running
- Verify base URL in `api_config.dart`
- Check network connectivity

### "Token expired" error
- User needs to login again
- Call `_authService.logout()` and redirect to login

### URL not updating
- Make sure you saved `api_config.dart`
- Restart the app (hot reload won't work for const changes)

## Need More Help?

- **Architecture details**: See `ARCHITECTURE.md`
- **Migration guide**: See `MIGRATION_GUIDE.md`
- **Full summary**: See `MOBILE_APP_REFACTOR_SUMMARY.md`

## Key Files

- `lib/config/api_config.dart` - **Change base URL here**
- `lib/services/auth_service.dart` - Authentication
- `lib/services/fuel_service.dart` - Fuel operations
- `lib/services/api_service.dart` - HTTP client

## Best Practices

1. ✅ Always use services, never hardcode URLs
2. ✅ Check `success` flag in responses
3. ✅ Handle errors gracefully
4. ✅ Show loading indicators
5. ✅ Keep screens simple, logic in services

## That's It!

You now have a professional, maintainable mobile app architecture. Happy coding! 🚀
