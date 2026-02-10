import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applicationStats, setApplicationStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const dashboardResponse = await apiService.getDashboardStats();
      setStats(dashboardResponse.data);

      const appStatsResponse = await apiService.getApplicationStats();
      setApplicationStats(appStatsResponse.data);
    } catch (error) {
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.fullName}!</p>

      {stats && (
        <div className="dashboard-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="stat-card">
              <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <div className="number">{value}</div>
            </div>
          ))}
        </div>
      )}

      {applicationStats.length > 0 && (
        <div className="card">
          <h2>Application Statistics</h2>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {applicationStats.map((stat) => (
                <tr key={stat.status}>
                  <td><span className={`badge badge-${stat.status}`}>{stat.status}</span></td>
                  <td>{stat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
