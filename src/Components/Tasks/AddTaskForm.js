// AddTaskForm.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem'; 

function AddTaskForm({ onAdd }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    isComplete: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(taskData);
    setTaskData({ title: '', description: '', isComplete: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        name="title"
        value={taskData.title}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Description"
        name="description"
        value={taskData.description}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        select
        label="Status"
        name="isComplete"
        value={taskData.isComplete}
        onChange={handleChange}
        fullWidth
        required
      >
        <MenuItem value={false}>Delayed</MenuItem>
        <MenuItem value={true}>Completed</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add Task
      </Button>
    </form>
  );
}

export default AddTaskForm;
