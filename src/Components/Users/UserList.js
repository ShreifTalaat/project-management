import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../api/api';
import './UserList.css'; // Import CSS file for styling

function UserList({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers();
        if (response.status === 200) {
          const responseData = response.data;
          if (responseData && responseData.data && Array.isArray(responseData.data)) {
            setUsers(responseData.data);
          } else {
            setError('Invalid response data format');
          }
        } else {
          setError(`Failed to fetch users: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error fetching users: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, [refreshKey]); // Refresh key dependency

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2 className="section-title">User List</h2>
      {users && users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="user-item">
                <td>{user.username}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-users">No users found.</div>
      )}
    </div>
  );
}

export default UserList;
