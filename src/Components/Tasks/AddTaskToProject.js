import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid, Box, Paper } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Add as AddIcon, Done as DoneIcon, HourglassEmpty as HourglassEmptyIcon, TaskAlt as TaskIcon } from '@mui/icons-material';
import { addTask, fetchTasks } from '../../api/api';
import TaskList from './TaskList';
import { useParams, useLocation } from 'react-router-dom';
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';

function AddTaskToProject({ onAdd }) {
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { projectId } = useParams();
  const location = useLocation();
  const projectNameEncoded = new URLSearchParams(location.search).get('projectName');
  const projectName = AES.decrypt(decodeURIComponent(projectNameEncoded), 'secretKey').toString(CryptoJS.enc.Utf8);

  const handleAddTask = async () => {
    if (!taskDescription || !status) {
      setErrorMessage('All fields are required');
      return;
    }

    const isComplete = status === 'completed';
  
    const taskData = {
      description: taskDescription,
      projectId: parseInt(projectId, 10),
      IsComplete: isComplete
    };
  
    try {
      const response = await addTask(taskData);
      console.log('Task added:', response.data);
      onAdd(response.data);
      setTaskDescription('');
      setStatus('');
      setSuccessMessage('Task added successfully');
      fetchTasks(projectId);
    } catch (error) {
      console.error('Error adding task:', error);
      setErrorMessage('Failed to add task');
    }
  };
  
  return (
    <Box p={3} component={Paper} elevation={3}>
      <Typography variant="h5" gutterBottom style={{ marginBottom: '1rem' }}>
        Add Task to Project : <span style={{ color: '#2196f3' }}>{projectName}</span>
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            label="Task"
            variant="outlined"
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            fullWidth
            required
            InputProps={{
              startAdornment: <TaskIcon color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="delayed">Delayed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            disabled={!taskDescription || !status}
            startIcon={<AddIcon />}
            fullWidth
          >
            Add Task
          </Button>
        </Grid>
        <Grid item xs={12}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Grid>
      </Grid>
      <Box mt={3}>
        <TaskList projectId={projectId} />
      </Box>
    </Box>
  );
}

export default AddTaskToProject;
