/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import {css} from '@emotion/react';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';
import scopes from '../utils/scopes';

// Spotify Auth package
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles


function CombinePlaylists() {

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;

    return (
        <>
        <Navigation/>
        <Container>
            <Row>
                <Col>
                    <h1> Combine your playlists!</h1>
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
                                    scopes={scopes}
                                />
                            </div>
                        )}
                </Col>
            </Row>

        </Container>
    </>
    );
  }

  export default CombinePlaylists;