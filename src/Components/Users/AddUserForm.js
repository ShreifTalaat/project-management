import React, { useState } from 'react';
import { addUser } from '../../api/api';
import './AddUserForm.css'; // Import CSS file for styling
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import WorkIcon from '@mui/icons-material/Work';

function AddUserForm({ onAdd }) {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    // Clear the error message for the username field
    setErrors({ ...errors, username: '' });
    // Update the user data
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    let isValid = true;
    const newErrors = { ...errors };

    if (!userData.username.trim() || userData.username.length < 3 || userData.username.length > 15) {
      newErrors.username = 'Username must be between 3 and 15 characters';
      isValid = false;
    } else {
      newErrors.username = '';
    }

    if (!userData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    if (!userData.role.trim() || userData.role.length < 3 || userData.role.length > 15) {
      newErrors.role = 'Role must be between 3 and 15 characters';
      isValid = false;
    } else {
      newErrors.role = '';
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await addUser(userData);
      if (response.status === 200) {
        if (response.data.data === -3) {
          setErrors({ ...errors, username: 'Username already exists' });
        } else {
          onAdd(response.data); // Call onAdd callback with new user data
          setUserData({ username: '', password: '', role: '' }); // Clear form inputs
          setSuccessMessage('User added successfully');
          setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
        }
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <TextField
        label="Username"
        variant="outlined"
        name="username"
        value={userData.username}
        onChange={handleChange}
        className="input-field"
        error={!!errors.username}
        helperText={errors.username}
        required
        inputProps={{ minLength: 3, maxLength: 15 }}
        InputProps={{
          startAdornment: <PersonIcon />
        }}
      />
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        name="password"
        value={userData.password}
        onChange={handleChange}
        className="input-field"
        error={!!errors.password}
        helperText={errors.password}
        required
        InputProps={{
          startAdornment: <LockIcon />
        }}
      />
      <TextField
        label="Role"
        variant="outlined"
        name="role"
        value={userData.role}
        onChange={handleChange}
        className="input-field"
        error={!!errors.role}
        helperText={errors.role}
        required
        inputProps={{ minLength: 3, maxLength: 15 }}
        InputProps={{
          startAdornment: <WorkIcon />
        }}
      />
      <Button type="submit" variant="contained" color="primary" className="submit-button">
        Add User
      </Button>
    </form>
  );
}

export default AddUserForm;
