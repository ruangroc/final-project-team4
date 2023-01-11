import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import _ from "lodash";
import { getParamValues } from "../utils/functions";
import { useDispatch } from "react-redux";
import { logIn } from "../redux/actions";
import Cookies from "js-cookie";

function Redirect() {
  let location = useLocation();
  let history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (_.isEmpty(location.hash)) {
        return history.push("/dashboard");
      }
      const access_token = getParamValues(location.hash);
      console.log(access_token);

      // set Spotify cookie
      const expiryTime = new Date(
        new Date().getTime() + access_token.expires_in * 1000
      );
      Cookies.set("spotifyAuthToken", access_token, { expires: expiryTime });

      // change state to loggedIn
      const logInAction = logIn(access_token);
      dispatch(logInAction);

      history.push("/");
    } catch (error) {
      history.push("/");
    }
  });

  return <></>;
}

export default Redirect;
