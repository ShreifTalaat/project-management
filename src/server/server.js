const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'https://project-management-zcwa.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
