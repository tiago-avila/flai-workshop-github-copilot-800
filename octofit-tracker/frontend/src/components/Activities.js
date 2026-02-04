import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities component - Fetching from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities component - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        setActivities(activitiesData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Activities component - Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="container mt-4 loading"><h2>Loading activities...</h2></div>;
  if (error) return <div className="container mt-4 error"><h2>Error: {error}</h2></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Fitness Activities</h2>
      <div className="mb-3 text-muted text-center">
        <p>Total Activities: <strong>{activities.length}</strong></p>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Distance (km)</th>
              <th>Calories</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity._id}>
                <td>
                  <span className="badge bg-info text-dark">
                    {activity.type.toUpperCase()}
                  </span>
                </td>
                <td><strong>{activity.duration}</strong> min</td>
                <td>{activity.distance > 0 ? `${activity.distance} km` : '-'}</td>
                <td><span className="badge bg-success">{activity.calories} cal</span></td>
                <td>
                  {activity.date 
                    ? new Date(activity.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'N/A'
                  }
                </td>
                <td><em>{activity.notes}</em></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activities;
