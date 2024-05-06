import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import projectman from '../../assets/Images/iStock-1135541613.webp'; 

function HomePage({ isLoggedIn }) {
  return (
    <div style={{ 
      backgroundImage: `url(${projectman})`, // Set the background image
      backgroundSize: 'cover', // Cover the entire background
      backgroundBlendMode: 'multiply', // Decrease contrast of background image
      minHeight: '100vh', // Make sure the background covers the whole viewport height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ marginTop: '40px', padding: '20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.7)' }}>
          <Typography variant="h4" gutterBottom>
            {isLoggedIn ? 'Welcome to the Project Management Portal' : 'Please login to access the Project Management Portal'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Description of the Website :
          </Typography>
          <Typography variant="body1" gutterBottom>
            This is the Project Management Portal, designed to help you organize and manage your projects efficiently.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Explore various features such as user management, project creation, task assignment, and much more.
          </Typography>
         
        </Paper>
      </Container>
    </div>
  );
}

export default HomePage;
