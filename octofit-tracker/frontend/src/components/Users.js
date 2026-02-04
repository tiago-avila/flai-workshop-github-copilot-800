import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', team: '' });
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  useEffect(() => {
    console.log('Users component - Fetching from:', API_URL);
    fetchUsers();
  }, [API_URL]);

  const fetchUsers = () => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users component - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        setUsers(usersData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Users component - Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      team: user.team
    });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`${API_URL}${editingUser._id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const updatedUser = await response.json();
      
      // Update the users list with the updated user
      setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      setSaveSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        setEditingUser(null);
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Error updating user:', error);
      setSaveError(error.message);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setSaveError(null);
    setSaveSuccess(false);
  };

  if (loading) return <div className="container mt-4 loading"><h2>Loading users...</h2></div>;
  if (error) return <div className="container mt-4 error"><h2>Error: {error}</h2></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Superhero Users</h2>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Team</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td><strong>{user.name}</strong></td>
                <td>@{user.email.split('@')[0]}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.team === 'Team Marvel' ? 'bg-danger' : 'bg-primary'}`}>
                    {user.team}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(user)}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <h5 className="modal-title">Edit User Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                {saveSuccess && (
                  <div className="alert alert-success">User updated successfully! ✅</div>
                )}
                {saveError && (
                  <div className="alert alert-danger">Error: {saveError}</div>
                )}
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team" className="form-label">Team</label>
                    <select
                      className="form-select"
                      id="team"
                      name="team"
                      value={formData.team}
                      onChange={handleInputChange}
                    >
                      <option value="Team Marvel">Team Marvel</option>
                      <option value="Team DC">Team DC</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
