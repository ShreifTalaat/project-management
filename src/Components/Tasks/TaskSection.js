import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTasks } from '../../api/api';
import TaskList from './TaskList';

function TaskSection({ onAdd }) {
  const [tasks, setTasks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await fetchTasks(projectId);
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, [projectId, refreshKey]);

  const handleTaskAdd = (newTask) => {
    setTasks([...tasks, newTask]);
    setRefreshKey((prevKey) => prevKey + 1); // Trigger refresh
  };

  return (
    <div>
      <TaskList tasks={tasks} />

      <AddTaskToProject onAdd={handleTaskAdd} />
    </div>
  );
}

export default TaskSection;
