import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Icon, Menu } from 'antd';
import { Viewer } from '../../../../lib//types';
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { logOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/logOut';
import { useMutation } from '@apollo/react-hooks';
import {
  displaySuccessNotification,
  displayErrorMessage,
} from '../../../../lib/utils';

const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        displaySuccessNotification("You've successfully logged Out");
      }
    },

    onError: (data) => {
      displayErrorMessage(
        'Sorry we were not able to log you out, Please try again later!'
      );
    },
  });

  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key="/user">
          <Link to={`/user/${viewer.id}`}>
            <Icon type="user" />
            Profile
          </Link>
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <Icon type="logout" />
            LogOut
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <Icon type="home" />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
