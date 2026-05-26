# Mobile App Architecture

## Overview
This Flutter mobile app follows a clean, professional architecture with proper separation of concerns.

## Project Structure

```
mobile_app/
├── lib/
│   ├── config/              # Configuration files
│   │   ├── api_config.dart  # API endpoints and base URL
│   │   └── app_config.dart  # App-wide constants
│   │
│   ├── services/            # Business logic and API calls
│   │   ├── api_service.dart # HTTP client wrapper
│   │   ├── auth_service.dart # Authentication logic
│   │   └── fuel_service.dart # Fuel operations
│   │
│   ├── screens/             # UI screens
│   │   ├── login_screen.dart
│   │   ├── dashboard_screen.dart
│   │   ├── fuel_dispense_screen.dart
│   │   └── transaction_history_screen.dart
│   │
│   ├── widgets/             # Reusable UI components
│   │   └── custom_input.dart
│   │
│   ├── theme/               # Theme configuration
│   │   └── app_theme.dart
│   │
│   └── main.dart            # App entry point
│
└── assets/                  # Images, fonts, etc.
```

## Architecture Layers

### 1. Configuration Layer (`config/`)
Centralized configuration management.

#### `api_config.dart`
- **Purpose**: Single source of truth for all API endpoints
- **Key Features**:
  - Base URL configuration
  - Environment-specific URLs (dev, staging, production)
  - Timeout configurations
  - Helper methods for building URLs

**Usage:**
```dart
// Change base URL in one place
static const String baseUrl = 'http://localhost:5000';

// All endpoints automatically use this base URL
String url = ApiConfig.buildUrl('/attendants/login');
```

#### `app_config.dart`
- **Purpose**: App-wide constants and configuration
- **Contains**:
  - App information (name, version)
  - Storage keys
  - UI constants
  - Validation rules

### 2. Service Layer (`services/`)
Business logic and API communication.

#### `api_service.dart`
- **Purpose**: Centralized HTTP client
- **Features**:
  - Singleton pattern for single instance
  - Automatic header management
  - Token authentication
  - Timeout handling
  - Error handling

**Methods:**
- `post()` - POST requests
- `get()` - GET requests
- `put()` - PUT requests
- `delete()` - DELETE requests
- `setToken()` - Set auth token
- `clearToken()` - Clear auth token

#### `auth_service.dart`
- **Purpose**: Authentication operations
- **Features**:
  - Login/logout
  - Token management
  - Local storage integration
  - Session persistence

**Methods:**
- `login()` - Authenticate user
- `logout()` - Clear session
- `isLoggedIn()` - Check auth status
- `getAttendantData()` - Get stored user data

#### `fuel_service.dart`
- **Purpose**: Fuel-related operations
- **Features**:
  - QR code scanning
  - Fuel dispensing
  - Transaction history

**Methods:**
- `getEntityByQR()` - Fetch vehicle/entity data
- `dispenseFuel()` - Record fuel transaction
- `getTransactions()` - Get transaction history

### 3. Presentation Layer (`screens/`)
UI screens and user interaction.

Each screen:
- Uses services for business logic
- Manages local UI state
- Handles user input
- Displays data

### 4. Widget Layer (`widgets/`)
Reusable UI components.

- Custom input fields
- Buttons
- Cards
- etc.

## Key Design Patterns

### 1. Singleton Pattern
Used in `ApiService` to ensure single HTTP client instance.

```dart
static final ApiService _instance = ApiService._internal();
factory ApiService() => _instance;
```

### 2. Service Pattern
Business logic separated into dedicated service classes.

### 3. Configuration Pattern
Centralized configuration management.

## Benefits of This Architecture

### 1. Maintainability
- Easy to find and update code
- Clear separation of concerns
- Single responsibility principle

### 2. Scalability
- Easy to add new features
- Modular structure
- Reusable components

### 3. Testability
- Services can be mocked
- Business logic isolated
- Unit testing friendly

### 4. Configuration Management
- **Single Source of Truth**: Change base URL in one place
- **Environment Switching**: Easy to switch between dev/staging/production
- **No Hardcoding**: No URLs scattered across files

## Changing Base URL

### For Development (localhost)
```dart
// In api_config.dart
static const String baseUrl = 'http://localhost:5000';
```

### For Network Testing
```dart
// In api_config.dart
static const String baseUrl = 'http://192.168.43.237:5000';
```

### For Production
```dart
// In api_config.dart
static const String baseUrl = 'https://api.yourproduction.com';
```

**That's it!** All screens and services automatically use the new URL.

## API Service Usage Example

### Before (Old Way - Hardcoded URLs)
```dart
// ❌ Bad: URL hardcoded in screen
final res = await http.post(
  Uri.parse('http://192.168.43.237:5000/api/attendants/login'),
  // ...
);
```

### After (New Way - Using Services)
```dart
// ✅ Good: Using service layer
final result = await _authService.login(phone, password);
```

## Error Handling

All services return standardized response format:

```dart
{
  'success': true/false,
  'data': {...},        // On success
  'message': '...'      // On error
}
```

This makes error handling consistent across the app.

## Adding New Features

### 1. Add New Endpoint
```dart
// In api_config.dart
static String get newFeatureEndpoint => '$baseUrl$apiPrefix/new-feature';
```

### 2. Create Service Method
```dart
// In appropriate service file
Future<Map<String, dynamic>> newFeature() async {
  final response = await _apiService.get('/new-feature');
  // Handle response
}
```

### 3. Use in Screen
```dart
// In screen
final result = await _service.newFeature();
if (result['success']) {
  // Handle success
}
```

## Best Practices

1. **Never hardcode URLs** - Always use `ApiConfig`
2. **Use services** - Don't make HTTP calls directly in screens
3. **Handle errors** - Always check `success` flag in responses
4. **Keep screens simple** - Move logic to services
5. **Reuse widgets** - Create custom widgets for repeated UI
6. **Follow naming conventions** - Clear, descriptive names

## Migration Guide

To migrate existing screens to use the new architecture:

1. Replace hardcoded URLs with service calls
2. Move business logic to appropriate service
3. Use standardized error handling
4. Update imports

Example:
```dart
// Old
final res = await http.post(Uri.parse('http://...'), ...);

// New
final result = await _authService.login(phone, password);
```

## Dependencies

Required packages:
- `http` - HTTP client
- `shared_preferences` - Local storage
- `flutter/material` - UI framework

## Future Enhancements

Potential improvements:
- State management (Provider, Riverpod, Bloc)
- Offline support
- Caching layer
- Analytics integration
- Crash reporting
- Push notifications

## Conclusion

This architecture provides a solid foundation for a professional, maintainable Flutter application. The centralized configuration and service layer make it easy to manage API endpoints and business logic.
