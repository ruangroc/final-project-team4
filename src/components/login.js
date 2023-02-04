import React from "react";
import scopes from "../utils/scopes";

// Spotify Auth package
import { SpotifyAuth } from "react-spotify-auth";
import "react-spotify-auth/dist/index.css"; // if using the included styles

function Login() {
  return (
    <div>
      <SpotifyAuth
        redirectUri="https://unpawsthemusic.vercel.app/redirect"
        clientID={process.env.REACT_APP_API_KEY}
        scopes={scopes}
        title="Login into Spotify"
      />
    </div>
  );
}

export default Login;
