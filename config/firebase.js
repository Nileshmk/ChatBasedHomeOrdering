
// FCM loaders
var admin = require('firebase-admin');

var serviceAccount = require("./kartoch-creds.json");

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kartoch-2324.firebaseio.com"
});

module.exports = app;