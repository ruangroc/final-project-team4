import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, isLoggedIn } from '../redux/selectors';

// react spotify package
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'

export default function Home() {

    const handleLogin = () => {
        window.location = `https://accounts.spotify.com/authorize?client_id=164e3321d4714ea2b1d88976aeecb258&redirect_uri=http://localhost:3000/redirect&response_type=token&show_dialog=true`;
    };

    // change this to redux later
    /*const token = localStorage.getItem("params");
    console.log("token: ", token);*/
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
                                <Button variant="info" type="submit" onClick={handleLogin}>
                                    Login to spotify
                                </Button>
                            )}
                    </Col>
                </Row>
            </Container>
        </>
    );
  }