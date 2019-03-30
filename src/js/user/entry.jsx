import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import UserList from './userlist';
import { AddUser, UpdateUser, UserStatisticsPage } from './manageuser';
import { ProfileEditor, UserStats } from './userinfo';
import { UserLogin } from './login';
import { ProfileRecentOpLogsPage, UserRecentOpLogsPage } from './oplogs';
import { UsersStatisticsPage } from './stats';
import { UserAdd } from './userAdd';

ReactDom.render((
    <Router history={browserHistory}>
        <Route path='/users' component={UserList} />
        <Route path='/users/statistics' component={UsersStatisticsPage} />
        <Route path='/admin/adduser' component={AddUser} />
        <Route path='/admin/useradd*' component={UserAdd} />
        <Route path='/user/:id' component={UpdateUser} />
        <Route path='/user/:id/statistics' component={UserStatisticsPage} />
        <Route path='/user/:id/op_logs/recent' component={UserRecentOpLogsPage} />
        <Route path='/profile' component={ProfileEditor} />
        <Route path='/profile/statistics' component={UserStats} />
        <Route path='/profile/op_logs/recent' component={ProfileRecentOpLogsPage} />
        <Route path='/auth/login' component={UserLogin} />
    </Router>
), document.getElementById('main')
);
