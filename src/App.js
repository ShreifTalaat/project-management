import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import UserList from './Components/Users/UserList';
import AddUserForm from './Components/Users/AddUserForm';
import ProjectList from './Components/Projects/ProjectList';
import AddProjectForm from './Components/Projects/AddProjectForm';
import AddTaskToProject from './Components/Tasks/AddTaskToProject';
import TaskList from './Components/Tasks/TaskList'; // Import TaskList component
import Login from './Components/Auth/Login';
import Logout from './Components/Auth/Logout';
import { fetchProjects, fetchTasks, addTask } from './api/api';
import HomePage from './Components/Home/HomePage';
function App() {

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userRefreshKey, setUserRefreshKey] = useState(0); // Refresh key for user list
  const [projectRefreshKey, setProjectRefreshKey] = useState(0); // Added to manage project list refreshing
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await fetchProjects();
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

  }, [projectRefreshKey]);

  const fetchTasksData = async (projectId) => {
    try {
      const response = await fetchTasks(projectId);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddUser = (userData) => {
    setUsers([...users, userData]);
    setUserRefreshKey(prevKey => prevKey + 1);
  };

  const handleAddProject = (projectData) => {
    setProjects([...projects, projectData]);
    setProjectRefreshKey(prevKey => prevKey + 1);
  };

  const handleAddTask = async (taskData) => {
    try {
      await addTask(taskData);
      fetchTasksData(taskData.projectId); // Fetch tasks again after adding a new task
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the authentication token
    setIsLoggedIn(false); // Update isLoggedIn state
    window.location.href = '/login'; // Navigate to the login page
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
        <AppBar position="static" style={{ marginBottom: '20px' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Project Management Portal
            </Typography>
            <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>Home</Button>
            <Button color="inherit" component={Link} to="/users" startIcon={<PeopleIcon />}>Users</Button>
            <Button color="inherit" component={Link} to="/projects" startIcon={<WorkIcon />}>Projects</Button>
            {isLoggedIn ? (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box my={4}>
            <Routes>
              <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
              {isLoggedIn && (
                <>
                  <Route path="/users" element={<UserSection onAdd={handleAddUser} users={users} refreshKey={userRefreshKey} />} />
                  <Route path="/projects" element={<ProjectSection onAdd={handleAddProject} projects={projects} refreshKey={projectRefreshKey} />} />
                  <Route path="/projects/:projectId" element={<TaskList fetchTasks={fetchTasksData} tasks={tasks} />} />
                  <Route path="/projects/:projectId/add-task" element={<AddTaskToProject onAdd={handleAddTask} fetchTasks={fetchTasksData} />} />
                  <Route path="/logout" element={<Logout />} />
                </>
              )}
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> {/* Pass setIsLoggedIn to Login component */}
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </Container>
      </div>
    </Router>
  );
}

function UserSection({ onAdd, users, refreshKey }) {
  return (
    <div>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <AddUserForm onAdd={onAdd} />
      <UserList users={users} refreshKey={refreshKey} />
    </div>
  );
}

function ProjectSection({ onAdd, projects, refreshKey }) {
  return (
    <div>
      <Typography variant="h5" gutterBottom>Project Management</Typography>
      <AddProjectForm onAdd={onAdd} />
      <ProjectList projects={projects} refreshKey={refreshKey} />
    </div>
  );
}

export default App;
