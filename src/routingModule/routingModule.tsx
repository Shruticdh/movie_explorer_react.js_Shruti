import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import MovieDetail from '../pages/MovieDetail';
import AllMovies from '../pages/AllMovies';
import MovieForm from '../pages/MovieForm';
import GenreSection from '../pages/GenreSection';
import Success from '../pages/Success';
import SubscriptionPage from '../pages/SubscribePage';
import UserProfile from '../pages/userProfile';
import Cancel from '../pages/Cancel';

const RoutingModule: React.FC = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>}></Route>
        <Route path="/movie-details/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>}></Route>
        <Route path="/add-movie" element={<ProtectedRoute><MovieForm /></ProtectedRoute>}></Route>
        <Route path="/movies/:id/edit" element={<ProtectedRoute><MovieForm /></ProtectedRoute>} />
        <Route path="/all-movies" element={<ProtectedRoute><AllMovies /></ProtectedRoute>} />
        <Route path="/genre" element={<ProtectedRoute><GenreSection /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default RoutingModule;