import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers } from '../actions';
import { Helmet } from 'react-helmet';

class UsersListPage extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  renderUsers() {
    return this.props.users.map(user => (
      <li key={user.id}>{user.name}</li>
    ));
  }

  head() {
    return (
      <Helmet>
        <title>{`${this.props.users.length} Users Loaded`}</title>
        <meta property="og:title" content="SSR APP"/>
      </Helmet>
    );
  }
  
  render() {
    return (
      <div>
        {this.head()}
        Here's the list of users:
        <ul>{this.renderUsers()}</ul>
      </div>
    );
  }
}

const loadData = (store) => {
  return store.dispatch(fetchUsers());
};

const mapStateToProps = state => ({ users: state.users });


export default {
  loadData,
  component: connect(mapStateToProps, { fetchUsers })(UsersListPage)
};