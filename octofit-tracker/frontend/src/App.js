import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src="/octofitapp-small.png" alt="OctoFit Logo" className="navbar-logo me-2" />
              OctoFit Tracker
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">Workouts</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container mt-4">
              <div className="text-center mb-5">
                <h1>Welcome to OctoFit Tracker</h1>
                <p className="lead">Track your fitness journey with superheroes! 💪</p>
              </div>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <Link to="/users" style={{ textDecoration: 'none' }}>
                    <div className="card home-card">
                      <div className="card-body">
                        <h5 className="card-title">👥 Users</h5>
                        <p className="card-text">View all registered superhero users and their teams.</p>
                        <span className="btn btn-primary w-100">View Users</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4 mb-4">
                  <Link to="/teams" style={{ textDecoration: 'none' }}>
                    <div className="card home-card">
                      <div className="card-body">
                        <h5 className="card-title">🦸 Teams</h5>
                        <p className="card-text">Explore Team Marvel and Team DC's missions.</p>
                        <span className="btn btn-primary w-100">View Teams</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4 mb-4">
                  <Link to="/activities" style={{ textDecoration: 'none' }}>
                    <div className="card home-card">
                      <div className="card-body">
                        <h5 className="card-title">🏃 Activities</h5>
                        <p className="card-text">See all logged fitness activities and workouts.</p>
                        <span className="btn btn-primary w-100">View Activities</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-6 mb-4">
                  <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                    <div className="card home-card">
                      <div className="card-body">
                        <h5 className="card-title">🏆 Leaderboard</h5>
                        <p className="card-text">Check competitive rankings and see who's leading!</p>
                        <span className="btn btn-success w-100">View Leaderboard</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-6 mb-4">
                  <Link to="/workouts" style={{ textDecoration: 'none' }}>
                    <div className="card home-card">
                      <div className="card-body">
                        <h5 className="card-title">💪 Workouts</h5>
                        <p className="card-text">Discover personalized superhero workout suggestions.</p>
                        <span className="btn btn-success w-100">View Workouts</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
