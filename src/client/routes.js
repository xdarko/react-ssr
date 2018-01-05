import App from './App';
import HomePage from './pages/HomePage';
import UsersListPage, { loadData } from './pages/UsersListPage';

export default [{
  ...App,
  routes: [
    {
      path: '/',
      exact: true,
      ...HomePage
    },
    {
      path: '/users',
      ...UsersListPage
    }
  ]
}];
