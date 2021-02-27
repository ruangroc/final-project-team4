import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { isLoggedIn } from '../redux/selectors';

// Spotify Auth package
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles

export default function Home() {

    /*const handleLogin = () => {
        window.location = `https://accounts.spotify.com/authorize?client_id=164e3321d4714ea2b1d88976aeecb258&redirect_uri=http://localhost:3000/redirect&response_type=token&show_dialog=true`;
    };*/

    const auth = useSelector(isLoggedIn);
    const loggedIn = auth.loggedIn;
    console.log("logged in: ", loggedIn);

    return (
        <>
            <Navigation/>
            <Container>
                <Row>
                    <Col>
                        <h1> Spotify Interactive </h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {loggedIn ? (
                            <div>
                                ur logged in woo
                            </div>
                        ) : (
                                <SpotifyAuth
                                    redirectUri='http://localhost:3000/redirect'
                                    clientID='164e3321d4714ea2b1d88976aeecb258'
                                    scopes={[Scopes.userReadPrivate, Scopes.userReadEmail]}
                                />
                            )}
                    </Col>
                </Row>
            </Container>
        </>
    );
  }