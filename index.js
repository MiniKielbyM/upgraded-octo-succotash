const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const md = require('markdown-it')();
const port = process.env.PORT || 3030;
const fileUpload = require('express-fileupload'); // Require express-fileupload
const path = require('path'); // Added for file handling
const fs = require('fs'); // Added for file handling

app.use(express.static('public'));
app.use("/auth", express.static(__dirname + "/login.html"));

// Use the fileUpload middleware
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Add a route for handling image uploads
app.post('/upload', (req, res) => {
  // Handle the image upload here
  const uploadDir = path.join(__dirname, 'uploads'); // Directory where uploaded images will be stored

  // Create the 'uploads' directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const upload = req.files.image; // 'image' should match the field name in the HTML form

  // Move the uploaded image to the 'uploads' directory
  upload.mv(path.join(uploadDir, upload.name), (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Respond with a success message or other relevant response
    res.send('Image uploaded successfully');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    console.log('chat msg received on server from client');
    outmsg = [msg[0], md.render(msg[1]), msg[2]];
    io.emit('chat message', outmsg);
    console.log(msg);
    console.log(outmsg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
