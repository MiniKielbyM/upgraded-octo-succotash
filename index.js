
var express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var md = require('markdown-it')();
const port = process.env.PORT || 3030;
app.use(express.static('public'))
app.use("/auth", express.static(__dirname + "/login.html"));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  socket.on('chat message', msg => {
console.log('chat msg received on server from client')
    outmsg = [msg[0], md.render(msg[1])]
    io.emit('chat message', outmsg);
    console.log(msg)
    console.log(outmsg)
  });
});

/*const DescopeClient = require('@descope/node-sdk');

let descopeClient;

try {
    descopeClient = DescopeClient({ projectId: 'P2UyYHH8xdJz6jgOAk3SzVbawVyg' });
} catch (error) {
    console.log("failed to initialize: " + error)
}

// Fetch session token from HTTP Authorization Header
const sessionToken = "xxxx"

async function validateSession() {
  try {
    const authInfo = await descopeClient.validateSession(sessionToken);
    console.log("Successfully validated user session:");
    console.log(authInfo);
  } catch (error) {
    console.log ("Could not validate user session " + error);
  }
}

validateSession();
*/
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
