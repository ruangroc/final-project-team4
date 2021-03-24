import React from 'react';
import scopes from '../utils/scopes';

// Spotify Auth package
import { SpotifyAuth} from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles

function Login() {
    return (
    <div>
        <SpotifyAuth
            // redirectUri='http://localhost:3000/redirect'
            redirectUri='https://spotify-interactive.vercel.app/redirect'
            // clientID='164e3321d4714ea2b1d88976aeecb258'
            clientId={process.env.REACT_APP_API_KEY}
            scopes={scopes}
            title="Login into Spotify"
        />
    </div>
    );
  }
  
  export default Login;