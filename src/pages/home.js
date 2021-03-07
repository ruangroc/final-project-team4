import Navigation from "../components/navbar";
import {Container, Row, Col, Jumbotron, Button} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';
import scopes from '../utils/scopes';

// Spotify Auth package
import { SpotifyAuth} from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles

export default function Home() {

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;
    console.log("logged in: ", loggedIn);

    return (
        <>
            <Navigation/>
            <Container >
                <br></br>

                    <Jumbotron>
                        <h1> Spotify Interactive </h1>
                        <p> Learn and interact with your Spotify music taste with statistics and cat visualizations. Find out what music the developers are listening to and combine your playlists with our playlist combiner feature. </p>
                        <br></br>
                        <br></br>
                        <Button variant="outline-success" href='https://github.com/osu-cs499-w21/final-project-team4'>Github </Button>
                    </Jumbotron>

                <Row>
                    <Col>
                        {loggedIn ? (
                            <div>
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