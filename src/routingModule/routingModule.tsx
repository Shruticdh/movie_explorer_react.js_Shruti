// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from '../pages/Login';
// import SignupPage from '../pages/Signup';
// import Dashboard from '../pages/Dashboard';
// import ProtectedRoute from './ProtectedRoute';
// import PublicRoute from './PublicRoute';
// import MovieDetail from '../pages/MovieDetail';
// import AllMovies from '../pages/AllMovies';
// import MovieForm from '../pages/MovieForm';
// import GenreSection from '../pages/GenreSection';
// import Success from '../pages/Success';
// import SubscriptionPage from '../pages/SubscribePage';

// const RoutingModule: React.FC = () => {
  
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
//         <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
//         <Route path="/subscription" element={<SubscriptionPage />}></Route>
//         <Route path="/movie-details/:id" element={<MovieDetail />}></Route>
//         <Route path="/add-movie" element={<MovieForm />}></Route>
//         <Route path="/movies/:id/edit" element={<ProtectedRoute><MovieForm /></ProtectedRoute>} />
//         <Route path="/all-movies" element={<ProtectedRoute><AllMovies /></ProtectedRoute>} />
//         <Route path="/genre" element={<ProtectedRoute><GenreSection /></ProtectedRoute>} />
//         <Route path="/success" element={<Success />} />
//       </Routes>
//     </Router>
//   );
// };

// export default RoutingModule;

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

const RoutingModule: React.FC = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
        <Route path="/subscription" element={<SubscriptionPage />}></Route>
        <Route path="/movie-details/:id" element={<MovieDetail />}></Route>
        <Route path="/add-movie" element={<MovieForm />}></Route>
        <Route path="/movies/:id/edit" element={<MovieForm />} />
        <Route path="/all-movies" element={<AllMovies />} />
        <Route path="/genre" element={<GenreSection />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
};

export default RoutingModule;