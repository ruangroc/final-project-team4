import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "./redux/actions";
import Cookies from "js-cookie";
import "./App.css";

// Components
import Home from "./pages/home";
import Developers from "./pages/developers";
import Error from "./pages/error";
import ComhinePlaylists from "./pages/combineplaylists";
import UserStats from "./pages/userstats";
import Redirect from "./pages/redirect";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = Cookies.get("spotifyAuthToken");
    console.log("token: ", accessToken);
    if (accessToken !== undefined) {
      const logInAction = logIn(accessToken);
      dispatch(logInAction);
    }
  });

  return (
    <Switch>
      <Route path="/developers" component={Developers} />
      <Route path="/combineplaylists" component={ComhinePlaylists} />
      <Route path="/userstats" component={UserStats} />
      <Route path="/redirect" component={Redirect} />

      <Route exact path="/" component={Home} />
      <Route component={Error} />
    </Switch>
  );
}

export default App;
