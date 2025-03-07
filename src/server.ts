const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files

const app = express();

// Endpoint to update profile picture
app.post('/api/profile/picture', upload.single('profilePicture'), (req, res) => {
    // Logic to update the profile picture in the database
    res.send('Profile picture updated successfully!');
});

// Endpoint to update profile name
app.put('/api/profile/name', (req, res) => {
  const { name } = req.body; // Assuming the name is sent in the request body
  // Logic to update the profile name in the database
  res.send('Profile name updated successfully!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});