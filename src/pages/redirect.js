import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/actions';
import _ from 'lodash';
import { getParamValues } from '../utils/functions';

function Redirect() {
  let location = useLocation();
  let history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    //const { setExpiryTime, history, location } = this.props;

    try {
      if (_.isEmpty(location.hash)) {
        return history.push('/dashboard');
      }
      const access_token = getParamValues(location.hash);
      console.log(access_token);
      const expiryTime = new Date().getTime() + access_token.expires_in * 1000;
      localStorage.setItem('params', JSON.stringify(access_token));
      
      
      const logInAction = logIn(access_token);
      dispatch(logInAction);

      // still need to set expiry token
      localStorage.setItem('expiry_time', expiryTime);

      history.push('/');
    } catch (error) {
      history.push('/');
    }
  });

  return(
    <>
    </>
  );
}

export default Redirect;