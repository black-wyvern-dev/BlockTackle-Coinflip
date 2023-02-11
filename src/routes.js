import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LeaderBoard from './pages/LeaderBoard';
import Main from './pages/Main';
import Profile from './pages/Profile';
import History from './pages/History';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Main />
        </DashboardLayout>
      ),
      children: [{ element: <Navigate to="/" replace /> }, { path: '', element: <Main /> }]
    },
    {
      path: '/profile',
      element: (
        <DashboardLayout>
          <Profile />
        </DashboardLayout>
      ),
      children: [
        { element: <Navigate to="/profile" replace /> },
        { path: '', element: <Profile /> }
      ]
    },
    {
      path: '/leaderboard',
      element: (
        <DashboardLayout>
          <LeaderBoard />
        </DashboardLayout>
      ),
      children: [
        { element: <Navigate to="/leaderboard" replace /> },
        { path: '', element: <LeaderBoard /> }
      ]
    },
    {
      path: '/history',
      element: (
        <DashboardLayout>
          <History />
        </DashboardLayout>
      ),
      children: [
        { element: <Navigate to="/history" replace /> },
        { path: '', element: <History /> }
      ]
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ]);
}
