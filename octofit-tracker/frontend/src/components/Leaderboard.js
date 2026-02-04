import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard component - Fetching from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard component - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Leaderboard component - Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="container mt-4 loading"><h2>Loading leaderboard...</h2></div>;
  if (error) return <div className="container mt-4 error"><h2>Error: {error}</h2></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Competition Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center">Rank</th>
              <th>Team</th>
              <th className="text-center">Total Calories</th>
              <th className="text-center">Total Duration</th>
              <th className="text-center">Total Distance</th>
              <th className="text-center">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(entry => (
              <tr key={entry._id} className={entry.rank <= 3 ? 'table-warning' : ''}>
                <td className="text-center">
                  <span className={`badge ${entry.rank === 1 ? 'bg-warning text-dark' : entry.rank === 2 ? 'bg-secondary' : entry.rank === 3 ? 'bg-info' : 'bg-light text-dark'} fs-5`}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </span>
                </td>
                <td>
                  <span className={`badge ${entry.team === 'Team Marvel' ? 'bg-danger' : entry.team === 'Team DC' ? 'bg-primary' : 'bg-secondary'} fs-6`}>
                    {entry.team || 'N/A'}
                  </span>
                </td>
                <td className="text-center"><strong>{(entry.total_calories || 0).toLocaleString()}</strong> cal</td>
                <td className="text-center"><strong>{entry.total_duration || 0}</strong> min</td>
                <td className="text-center"><strong>{entry.total_distance || 0}</strong> km</td>
                <td className="text-center text-muted">
                  {entry.last_updated 
                    ? new Date(entry.last_updated).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
