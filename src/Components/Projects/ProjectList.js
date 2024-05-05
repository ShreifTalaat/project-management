import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../api/api';
import Button from '@mui/material/Button';
import './ProjectList.css';
import { AES } from 'crypto-js';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const encryptProjectName = (name) => {
    const encrypted = AES.encrypt(name, 'secretKey').toString();
    return encodeURIComponent(encrypted);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await fetchProjects();
        if (projectsResponse.status === 200) {
          setProjects(projectsResponse.data);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (error) {
        setError(`Error fetching projects: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="project-list-container">
      <h2 className="section-title">Project List</h2>
      {projects && projects.length > 0 ? (
        <table className="project-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
           
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index} className="project-item">
                <td>{project.name}</td>
                <td>{project.description}</td>
           
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
                <td>
                <Link to={`/projects/${project.projectId}/add-task?projectName=${encryptProjectName(project.name)}`}>
  <Button variant="contained" color="primary">
    Add Task
  </Button>
</Link>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-projects">No projects found.</div>
      )}
    </div>
  );
}

export default ProjectList;
