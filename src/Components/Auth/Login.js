import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import { Visibility, VisibilityOff, AccountCircle } from '@material-ui/icons'; // Import AccountCircle icon

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing(2),
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper,
    textAlign: 'center',
  },
  input: {
    margin: theme.spacing(1, 0),
  },
  submit: {
    margin: theme.spacing(2, 0),
    width: '100%',
  },
  loader: {
    marginTop: theme.spacing(2),
  },
}));

function Login({ setIsLoggedIn }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsLoggedIn(true);
    try {
      const response = await login(formData);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else if(response.status===400) {
        setError('Invalid Passowrd or Username');
      }
    } catch (error) {
      setError('Invalid Passowrd or Username');
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Welcome Back!
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          className={classes.input}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          label="Username"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton disabled>
                  <AccountCircle />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className={classes.input}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          label="Password"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={togglePasswordVisibility} edge="start">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </form>
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
    </div>
  );
}

export default Login;
