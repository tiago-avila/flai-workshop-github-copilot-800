import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams component - Fetching from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams component - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        setTeams(teamsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Teams component - Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="container mt-4 loading"><h2>Loading teams...</h2></div>;
  if (error) return <div className="container mt-4 error"><h2>Error: {error}</h2></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Superhero Teams</h2>
      <div className="row justify-content-center">
        {teams.map(team => (
          <div key={team._id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header text-white" style={{
                background: team.name === 'Team Marvel' 
                  ? 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
                  : 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)'
              }}>
                <h3 className="mb-0">{team.name}</h3>
              </div>
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-muted">Mission Statement</h6>
                <p className="card-text lead">{team.description}</p>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Team Members</span>
                  <span className="badge bg-secondary fs-6">
                    {team.members && Array.isArray(team.members) ? team.members.length : 5} Heroes
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
