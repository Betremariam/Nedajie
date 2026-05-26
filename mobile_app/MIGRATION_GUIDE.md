# Migration Guide - Updating Screens to New Architecture

## Overview
This guide shows how to update existing screens to use the new service-based architecture.

## What Changed

### Before (Old Way)
```dart
// ❌ Hardcoded URL in every screen
final res = await http.post(
  Uri.parse('http://192.168.43.237:5000/api/attendants/login'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({'phone': phone, 'password': password}),
);
```

### After (New Way)
```dart
// ✅ Using service layer
final AuthService _authService = AuthService();
final result = await _authService.login(phone, password);
```

## Step-by-Step Migration

### 1. Update Imports

**Remove:**
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
```

**Add:**
```dart
import '../services/auth_service.dart';
import '../services/fuel_service.dart';
import '../config/app_config.dart';
```

### 2. Initialize Services

**Add to your State class:**
```dart
class _YourScreenState extends State<YourScreen> {
  final AuthService _authService = AuthService();
  final FuelService _fuelService = FuelService();
  
  // ... rest of your code
}
```

### 3. Update API Calls

#### Login Example

**Before:**
```dart
Future<void> login() async {
  try {
    final res = await http.post(
      Uri.parse('http://192.168.43.237:5000/api/attendants/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phone': phoneController.text,
        'password': passwordController.text,
      }),
    );

    final data = jsonDecode(res.body);
    if (res.statusCode == 200) {
      // Save to SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      // ... more saves
      
      // Navigate
      Navigator.pushReplacement(...);
    } else {
      setState(() => error = data['msg']);
    }
  } catch (e) {
    setState(() => error = 'Connection failed');
  }
}
```

**After:**
```dart
Future<void> login() async {
  final result = await _authService.login(
    phoneController.text,
    passwordController.text,
  );

  if (result['success']) {
    final attendant = result['data']['attendant'];
    Navigator.pushReplacement(...);
  } else {
    setState(() => error = result['message']);
  }
}
```

#### Fuel Dispense Example

**Before:**
```dart
final res = await http.post(
  Uri.parse('http://192.168.43.237:5000/api/attendants/dispense'),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  },
  body: jsonEncode({
    'userId': userId,
    'userType': userType,
    'liters': liters,
    'gasType': gasType,
    'fuelAttendantId': attendantId,
  }),
);
```

**After:**
```dart
final result = await _fuelService.dispenseFuel(
  userId: userId,
  userType: userType,
  liters: liters,
  gasType: gasType,
  fuelAttendantId: attendantId,
);

if (result['success']) {
  // Handle success
} else {
  // Handle error: result['message']
}
```

#### Get Entity by QR Example

**Before:**
```dart
final res = await http.get(
  Uri.parse('http://192.168.43.237:5000/api/attendants/vehicle/$entityId'),
  headers: {'Authorization': 'Bearer $token'},
);
```

**After:**
```dart
final result = await _fuelService.getEntityByQR(entityId);

if (result['success']) {
  final entityData = result['data'];
  // Use entityData
} else {
  // Handle error: result['message']
}
```

#### Get Transactions Example

**Before:**
```dart
final res = await http.get(
  Uri.parse('http://192.168.43.237:5000/api/attendants/transactions/$stationName'),
  headers: {'Authorization': 'Bearer $token'},
);
```

**After:**
```dart
final result = await _fuelService.getTransactions(stationName);

if (result['success']) {
  final transactions = result['data'];
  // Use transactions
} else {
  // Handle error: result['message']
}
```

## Screens to Update

### Priority 1 (Already Updated)
- ✅ `login_screen.dart` - Already migrated

### Priority 2 (Need Update)
- ⏳ `dashboard_screen.dart`
- ⏳ `fuel_dispense_screen.dart`
- ⏳ `transaction_history_screen.dart`

### Priority 3 (Can be removed)
- ❌ `register_screen.dart` - No longer needed (attendants registered by owners)

## Common Patterns

### Pattern 1: Loading State
```dart
setState(() {
  loading = true;
  error = null;
});

final result = await _service.someMethod();

setState(() {
  loading = false;
  if (!result['success']) {
    error = result['message'];
  }
});
```

### Pattern 2: Error Handling
```dart
if (result['success']) {
  // Success path
  final data = result['data'];
  // Use data
} else {
  // Error path
  setState(() => error = result['message']);
}
```

### Pattern 3: Navigation After Success
```dart
if (result['success']) {
  if (!mounted) return; // Check if widget is still mounted
  Navigator.pushReplacement(context, ...);
}
```

## Testing the Migration

After updating a screen:

1. **Test successful flow**
   - Verify the feature works as expected
   - Check data is displayed correctly

2. **Test error handling**
   - Test with wrong credentials
   - Test with network disconnected
   - Verify error messages display

3. **Test loading states**
   - Verify loading indicators show
   - Verify they hide after completion

## Checklist for Each Screen

- [ ] Remove hardcoded URLs
- [ ] Import appropriate services
- [ ] Initialize service instances
- [ ] Replace HTTP calls with service methods
- [ ] Update error handling
- [ ] Test all functionality
- [ ] Remove unused imports

## Benefits After Migration

1. **Easier Maintenance**: Change URL in one place
2. **Better Error Handling**: Consistent error format
3. **Cleaner Code**: Less boilerplate
4. **Type Safety**: Better IDE support
5. **Testability**: Services can be mocked

## Need Help?

If you encounter issues:
1. Check `ARCHITECTURE.md` for architecture overview
2. Look at `login_screen.dart` for reference implementation
3. Verify `api_config.dart` has correct base URL
4. Check console for error messages

## Quick Reference

### Service Methods

**AuthService:**
- `login(phone, password)` - Login
- `logout()` - Logout
- `isLoggedIn()` - Check auth status
- `getAttendantData()` - Get stored data

**FuelService:**
- `getEntityByQR(entityId)` - Get vehicle/entity
- `dispenseFuel(...)` - Dispense fuel
- `getTransactions(stationName)` - Get history

### Response Format
All services return:
```dart
{
  'success': bool,
  'data': dynamic,      // On success
  'message': String,    // On error
}
```

## Example: Complete Screen Migration

See `login_screen.dart` for a complete example of a migrated screen.
