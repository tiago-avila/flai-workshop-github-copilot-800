import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts component - Fetching from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts component - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(workoutsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Workouts component - Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="container mt-4 loading"><h2>Loading workouts...</h2></div>;
  if (error) return <div className="container mt-4 error"><h2>Error: {error}</h2></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Superhero Workout Suggestions</h2>
      <div className="row">
        {workouts.map(workout => (
          <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header" style={{
                background: workout.difficulty === 'advanced' 
                  ? 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
                  : workout.difficulty === 'intermediate'
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white'
              }}>
                <h5 className="mb-0">{workout.name}</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <span className="badge bg-info text-dark me-2">{workout.type}</span>
                  <span className={`badge ${
                    workout.difficulty === 'advanced' ? 'bg-danger' :
                    workout.difficulty === 'intermediate' ? 'bg-warning text-dark' :
                    'bg-success'
                  }`}>
                    {workout.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="card-text"><strong>⏱️ Duration:</strong> {workout.duration || 'N/A'} minutes</p>
                <p className="card-text"><em>{workout.description || 'No description available'}</em></p>
                <hr />
                <p className="card-text"><strong>Exercises:</strong></p>
                <ul className="text-muted small">
                  {workout.exercises && Array.isArray(workout.exercises) 
                    ? workout.exercises.map((exercise, index) => (
                        <li key={index}>{exercise}</li>
                      ))
                    : <li>No exercises listed</li>
                  }
                </ul>
              </div>
              <div className="card-footer bg-transparent">
                <button className="btn btn-primary btn-sm w-100">Start Workout</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
