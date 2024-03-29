// Import required modules
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Define API endpoints
const endpoints = {
  categories: 'https://threadnetbackendapi.azure-api.net/threadnet/api/' + 'Category/getAll',
  threads: 'https://threadnetbackendapi.azure-api.net/threadnet/api/' + 'Thread/getAll',
  users: 'https://threadnetbackendapi.azure-api.net/threadnet/api/' + 'User/getAll'
};

// Fetch data for categories, threads, and users
async function fetchData() {
  try {
    const [categoriesResponse, threadsResponse, usersResponse] = await Promise.all([
      axios.get(endpoints.categories),
      axios.get(endpoints.threads),
      axios.get(endpoints.users)
    ]);

    return {
      categories: categoriesResponse.data,
      threads: threadsResponse.data,
      users: usersResponse.data
    };
  } catch (error) {
    console.error('Error fetching data:', error.message);
    process.exit(1);
  }
}

// Generate route strings for categories, threads, and users
function generateContentRoutes(data) {
  const { categories, threads, users } = data;

  const categoryRoutes = categories.map(category => `category/${category.name}`);
  const threadRoutes = threads.map(thread => `thread/${thread.title}`);
  const userRoutes = users.map(user => `user/${user.username}`);

  // console.log("Generated")

  return [...categoryRoutes, ...threadRoutes, ...userRoutes];
}

function generateBaseRoutes(){
  const routes = [];
  const routeRegex = /path:\s*'((?:(?!:).)+)'/g;

  // App Routing module
  var routingModulePath = path.join(__dirname, 'src/app/app-routing.module.ts');
  var routingModuleContent = fs.readFileSync(routingModulePath, 'utf8');
  while ((match = routeRegex.exec(routingModuleContent)) !== null) {
    routes.push(match[1]);
  }

  // Auth Routing module
  var routingModulePath = path.join(__dirname, 'src/app/modules/auth/auth-routing.module.ts');
  var routingModuleContent = fs.readFileSync(routingModulePath, 'utf8');
  while ((match = routeRegex.exec(routingModuleContent)) !== null) {
    routes.push(match[1]);
  }

  // Content Routing module
  var routingModulePath = path.join(__dirname, 'src/app/modules/content/content-routing.module.ts');
  var routingModuleContent = fs.readFileSync(routingModulePath, 'utf8');
  while ((match = routeRegex.exec(routingModuleContent)) !== null) {
    routes.push(match[1]);
  }

  // Info Routing module
  var routingModulePath = path.join(__dirname, 'src/app/modules/info/info-routing.module.ts');
  var routingModuleContent = fs.readFileSync(routingModulePath, 'utf8');
  while ((match = routeRegex.exec(routingModuleContent)) !== null) {
    routes.push(match[1]);
  }

}

// Output routes to console
function writeRoutesToFile(routes) {
  const routesFilePath = path.join(__dirname, 'routes.txt');
  fs.writeFileSync(routesFilePath, routes.join('\n'));
}

// Main function to execute the script
async function main() {
  // console.log("Fetching Api Data...");
  const data = await fetchData();

  // console.log("Generating Content Routes...");
  const contentRoutes = generateContentRoutes(data);

  // console.log("Generating Base Routes...");
  const baseRoutes = generateBaseRoutes();

  const routes = baseRoutes.concat(contentRoutes);

  // Output routes
  // console.log("Writing routes to file...");
  writeRoutesToFile(routes);
  // console.log("Done");

  return 0;
}

// Run the script
main();
