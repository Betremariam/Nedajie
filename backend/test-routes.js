// Quick test to verify routes are loaded correctly
import express from 'express';
import adminsRoutes from './routes/adminsRoutes.js';

const app = express();
app.use('/api/admins', adminsRoutes);

// Get all registered routes
const routes = [];
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    routes.push({
      path: middleware.route.path,
      methods: Object.keys(middleware.route.methods)
    });
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const path = '/api/admins' + handler.route.path;
        routes.push({
          path: path,
          methods: Object.keys(handler.route.methods)
        });
      }
    });
  }
});

console.log('\n=== Registered Routes ===');
routes.forEach(route => {
  console.log(`${route.methods.join(', ').toUpperCase()} ${route.path}`);
});

// Check for vehicle-type-configs route
const vehicleTypeRoute = routes.find(r => r.path.includes('vehicle-type-configs'));
if (vehicleTypeRoute) {
  console.log('\n✅ vehicle-type-configs route found:', vehicleTypeRoute);
} else {
  console.log('\n❌ vehicle-type-configs route NOT found');
}
