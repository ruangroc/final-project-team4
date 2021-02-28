/**@jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {css} from '@emotion/react';
import {Route,Switch,useParams,useRouteMatch, Redirect, Link} from 'react-router-dom';
import { get } from '../utils/api';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';

// Spotify Auth package
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles

function Developer() {
    const {developer} = useParams();
    const { url, path } = useRouteMatch();
    const [dev, setDev] = useState([]);
    const [imageSrc, setImageSrc] =  useState("");
    const [devPlaylists, setDevPlaylists] = useState([]);

    const styles = css`
        .image {
            width: 350px;
            height: 300px;
        }
        .card {
            width: 350px;
            height: 100%;
            background-color: #3BE378;
        }
        a {
            color: black;
        }
        ul {
            list-style: none;
        }
        .sidebar {
            position: absolute;
            left: 0;
        }
    `;
    
    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;
    
    if(loggedIn) {
        if (developer == "thuyvy") {
            fetchspotifyuser("tweetynguy");
            fetchPlaylists("tweetynguy");
            setImageSrc("http://allaboutcat.org/wp-content/uploads/2017/09/cat-sticking-tongue-out-2.jpg");
        } else if (developer == "kristina") {
            fetchspotifyuser("kxlee14");
            fetchPlaylists("kxlee14");
            setImageSrc("https://i.imgur.com/xPy88y5.png");
        } else if (developer == "anita") {
            fetchspotifyuser("anitasmith98");
            fetchPlaylists("anitasmith98");
            setImageSrc("http://3.bp.blogspot.com/--7gtJQo5mHE/UGMKHZapqmI/AAAAAAAAWGU/5X26Pgj_St4/s1600/funny-cat-pictures-017-005.jpg");
        } else {
            return <Redirect to="/error" />
        }
    }
    else {
        console.log("not logged in!");
    }
    
    async function fetchspotifyuser(user){
        try{
            const url = `https://api.spotify.com/v1/users/${user}`;
            const result = await get(url);
            console.log("fetch spotify user result:", result);
            setDev(result || []);
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted")
            }
        }
    }

    async function fetchPlaylists(user){
        try{
            const url = `https://api.spotify.com/v1/users/${user}/playlists`;
            const result = await get(url);
            console.log("fetch spotify user playlists:", result);
            setDevPlaylists(result.items || {});
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted")
            }
        }
    }

    // could make each item a button that will link to the spotify web player's playlist
    function displayPlaylists() {
        return devPlaylists.map(item => {
            return (<Card>{item.name}</Card>);
        });
    }

    return (
<<<<<<< HEAD
        <Container fluid css={styles}>
            <Row>
                <Col className="sidebar">
                    <Row><Button><Link to="/developers/anita"> <h2> Anita</h2> </Link></Button></Row>
                    <Row><Button><Link to="/developers/kristina"> <h2>Kristina</h2> </Link></Button></Row>
                    <Row><Button><Link to="/developers/thuyvy"> <h2> ThuyVy</h2> </Link></Button></Row>
                </Col>
                <Col>
                    <Row>
                        <Col xs={3}>
                            {dev !== [] &&
                            (<Card>
                                <Card.Title> {dev.display_name} </Card.Title>
                                <Card.Img src={imageSrc} className="card" />
                                {dev.followers && dev.followers.total && (<Card.Text> {dev.followers.total} Followers </Card.Text>)}
                            </Card>)}
                        </Col>
                        <Col xs={9}>
                            {devPlaylists !== [] ? <Row>{displayPlaylists()}</Row> : <p>"Loading playlists..."</p>}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
=======
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
>>>>>>> master
    );
  }


function Developers() {
    const match = useRouteMatch();
    const { url, path } = match;

    const styles = css`
        .row {
            text-align: center;
            margin-top: 1%;
            margin-bottom: 1%;
        }

        .image {
            width: 350px;
            height: 300px;
        }

        .card {
            width: 350px;
            height: 100%;
            background-color: #3BE378;
        }

        a {
            color: black;
        }
    `;

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;
    console.log("logged in: ", loggedIn);

    return (
        <>
        <Navigation/>
        <Container css={styles}>
            <Switch>
                <Route path={`${path}/:developer`}>
                    <Developer />
                </Route>
                <Route exact path={path}>
                    <Row className="row">
                        <Col>
                            <h1 className="row">Meet the Developers!</h1>
                        </Col>
                    </Row>
                    <Row className="row">
                        <Col>
                            <Card className="row">
                                <Card.Img className="image" src="http://3.bp.blogspot.com/--7gtJQo5mHE/UGMKHZapqmI/AAAAAAAAWGU/5X26Pgj_St4/s1600/funny-cat-pictures-017-005.jpg" />
                                <Link to="/developers/anita"> <h2> Anita</h2> </Link>
                            </Card>  
                        </Col>
                        <Col>
                            <Card className="row">
                                <Card.Img className="image" src="https://i.imgur.com/xPy88y5.png" />
                                <Link to="/developers/kristina"> <h2>Kristina</h2> </Link>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="row">
                                <Card.Img className="image" src="http://allaboutcat.org/wp-content/uploads/2017/09/cat-sticking-tongue-out-2.jpg" />
                                <Link to="/developers/thuyvy"> <h2> ThuyVy</h2> </Link>
                            </Card>
                        </Col>
                    </Row>
                </Route>
            </Switch>
        </Container>
    </>
    );
  }

  export default Developers;