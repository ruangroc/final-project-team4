import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';
import scopes from '../utils/scopes';

// Spotify Auth package
import { SpotifyAuth } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles

export default function Home() {

    const auth = useSelector(getAuth);
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
                                <div>
                                    <h5>Please login:</h5>
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