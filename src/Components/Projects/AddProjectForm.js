import React, { useState, useEffect } from 'react';
import { addProject, fetchUsers } from '../../api/api'; 
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Alert } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

function AddProjectForm({ onAdd }) {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    owner: '',
    ownerName: '', // Added to store owner's name for UI display
    manager: '',
    managerName: '', // Added to store manager's name for UI display
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUsers();
        if (response.status === 200) {
          setUsers(response.data.data);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        setError(`Error fetching users: ${error.message}`);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProjectData({ ...projectData, [name]: value });
    setError('');
    
    // If the field is 'owner' or 'manager', find the selected user and set the corresponding userId
    if (name === 'owner' || name === 'manager') {
      // Find the selected user by userId
      const selectedUser = users.find(user => user.userId === value);
      // Set the corresponding user ID for database submission
      const userId = selectedUser ? selectedUser.userId : '';
      
      // Update the projectData state with the appropriate ID field
      const idFieldName = name === 'owner' ? 'OwnerId' : 'ManagerId';
      setProjectData(prevState => ({ ...prevState, [idFieldName]: userId }));
      
      // Set the ownerName or managerName for UI display
      const nameFieldName = name === 'owner' ? 'ownerName' : 'managerName';
      setProjectData(prevState => ({ ...prevState, [nameFieldName]: value }));
    }
  };
  
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await addProject(projectData);
      if (response.status === 200 && response.data.data === -3) {
        setError('Project with the same name already exists');
      } else if (response.status === 200) {
        setSuccess('Project added successfully');
        setProjectData({ name: '', description: '', owner: '', ownerName: '', manager: '', managerName: '', startDate: '', endDate: '' });
        onAdd();
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        alert('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error adding project');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            value={projectData.name}
            onChange={handleChange}
            required
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: (
                <TitleIcon color="action" />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            name="description"
            value={projectData.description}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <DescriptionIcon color="action" />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Owner"
            variant="outlined"
            fullWidth
            name="owner"
            value={projectData.owner}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <PersonIcon color="action" />
              ),
            }}
          >
            {users.map((user) => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.username}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Manager"
            variant="outlined"
            fullWidth
            name="manager"
            value={projectData.manager}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <PersonIcon color="action" />
              ),
            }}
          >
            {users.map((user) => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.username}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            fullWidth
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <DateRangeIcon color="action" />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            fullWidth
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <DateRangeIcon color="action" />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Project
          </Button>
        </Grid>
      </Grid>
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
    </form>
  );
}

export default AddProjectForm;