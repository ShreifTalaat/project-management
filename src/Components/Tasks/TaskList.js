import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTasks } from '../../api/api'; // Import fetchTasks
import { Grid, Typography, CircularProgress, Paper } from '@mui/material'; 

function TaskList() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTasks(projectId); // Use fetchTasks
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('No tasks yet:', error);
        setError('Not tasks yet.');
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return (
    <div>
      <Typography variant="h6">Task List</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '10px', borderBottom: '2px solid #000' }}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Description</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '10px', borderBottom: '2px solid #000' }}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Status</Typography>
            </Paper>
          </Grid>
          {tasks.map(task => (
            <React.Fragment key={task.taskId}>
              <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                  <Typography variant="body1">{task.description}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                  <Typography variant="body2">{task.isComplete ? 'Completed' : 'Delayed'}</Typography>
                </Paper>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default TaskList;
