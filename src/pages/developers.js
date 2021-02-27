/**@jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import {css} from '@emotion/react';
import {Route,Switch,useParams,useRouteMatch, Redirect, Link} from 'react-router-dom';
import { get } from '../utils/api';
import { useSelector } from 'react-redux';
import { isLoggedIn } from '../redux/selectors';

// Spotify Auth package
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles

function Developer() {
    const {developer} = useParams();
    const { url, path } = useRouteMatch();
    const [dev, setDev] = useState([]);

    const auth = useSelector(isLoggedIn);
    const loggedIn = auth.loggedIn;
    
    if(loggedIn) {
        if (developer == "thuyvy") {
            fetchspotifyuser("tweetynguy");
        } else if (developer == "kristina") {
            fetchspotifyuser("kxlee14");
        } else if (developer == "anita") {
            fetchspotifyuser("anitasmith98");
        } else {
            return <Redirect to="/error" />
        }
    }
    else {
        console.log("not logged in!")
    }
    
    async function fetchspotifyuser(user){
        try{
            const url = `https://api.spotify.com/v1/users/${user}`;
            const result = await get(url);
            console.log(result);
            setDev(result || []);
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted")
            }
        }
    }

    return (
      <div>
        <h2> {dev.display_name} </h2>
        {loggedIn ? (
            <div>
                logged in!
            </div>
        ) : (
                <div>
                    <h5>Please login to use this feature!</h5>
                    <SpotifyAuth
                        redirectUri='http://localhost:3000/redirect'
                        clientID='164e3321d4714ea2b1d88976aeecb258'
                        scopes={[Scopes.userReadPrivate, Scopes.userReadEmail]}
                    />
                </div>
            )}
        
      </div>
    );
  }


function Developers() {
    const match = useRouteMatch();
    const { url, path } = match;

    const row = css`
        text-align: center;
    `;

    const auth = useSelector(isLoggedIn);
    const loggedIn = auth.loggedIn;
    console.log("logged in: ", loggedIn);

    return (
        <>
        <Navigation/>
        <Container>
            <Switch>
                <Route path={`${path}/:developer`}>
                    <Developer />
                </Route>
                <Route exact path={path}>
                    <Row css={row}>
                        <Col>
                            <h1 css={row}>Meet the Developers!</h1>
                        </Col>
                    </Row>
                    <Row css={row}>
                        <Col>
                            <Link to="/developers/anita"> <h2> Anita</h2> </Link>
                        </Col>
                        <Col>
                            <Link to="/developers/kristina"> <h2>Kristina</h2> </Link>
                        </Col>
                        <Col>
                            <Link to="/developers/thuyvy"> <h2> ThuyVy</h2> </Link>
                        </Col>
                    </Row>
                </Route>
            </Switch>
        </Container>
    </>
    );
  }

  export default Developers;