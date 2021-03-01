/**@jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import {Container, Row, Col, Card, Button, CardDeck} from 'react-bootstrap';
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
    const [imageSrc, setImageSrc] =  useState({
        "thuyvy": "http://allaboutcat.org/wp-content/uploads/2017/09/cat-sticking-tongue-out-2.jpg",
        "kristina": "https://i.imgur.com/xPy88y5.png",
        "anita": "http://3.bp.blogspot.com/--7gtJQo5mHE/UGMKHZapqmI/AAAAAAAAWGU/5X26Pgj_St4/s1600/funny-cat-pictures-017-005.jpg"
    });
    const [devPlaylists, setDevPlaylists] = useState([]);

    const styles = css`
        .image {
            width: 200px;
            height: 200px;
        }
        .card {
            width: 200px;
            height: 250px;
            background-color: #3BE378;
            margin: 10px;
        }
        .dev-image {
            width: 350px;
            height: 300px;
        }
        .dev-card {
            width: 350px;
            height: 375px;
            background-color: #3BE378;
        }
        a {
            color: black;
        }
        ul {
            list-style: none;
        }
        .sidebar {
            padding: 1%;
        }
        .side-button {
            background-color: #3BE378;
            border: none;
        }
    `;
    
    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;
    
    useEffect(() => {
        if(loggedIn) {
            if (developer == "thuyvy") {
                fetchspotifyuser("tweetynguy");
                fetchPlaylists("tweetynguy");
            } else if (developer == "kristina") {
                fetchspotifyuser("kxlee14");
                fetchPlaylists("kxlee14");
            } else if (developer == "anita") {
                fetchspotifyuser("anitasmith98");
                fetchPlaylists("anitasmith98");
            } else {
                return <Redirect to="/error" />
            }
        }
        else {
            console.log("not logged in!");
        }
    }, [developer]);
    
    
    async function fetchspotifyuser(user){
        try{
            const url = `https://api.spotify.com/v1/users/${user}`;
            const result = await get(url, { access_token: auth.accessToken });
            console.log("fetch spotify user result:", result);
            setDev(result || []);
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted");
            }
            console.log("error fetching user", e);
        }
    }

    async function fetchPlaylists(user){
        try{
            const url = `https://api.spotify.com/v1/users/${user}/playlists`;
            const result = await get(url, { access_token: auth.accessToken });
            console.log("fetch spotify user playlists:", result);
            setDevPlaylists(result.items || []);
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted")
            }
            console.log("error fetching playlists", e);
        }
    }

    function displayPlaylists() {
        console.log("playlists:", devPlaylists);
        return devPlaylists.map(item => {
            return (
                <Card key={item.name}>
                    <Card.Title> <a href={`https://open.spotify.com/playlist/${item.id}`} target="_blank">{item.name}</a> </Card.Title>
                    <Card.Img src={item.images.length ? item.images[0].url : "https://img.talkandroid.com/uploads/2016/01/spotify-app-logo-450x450.png"} className="image" />
                </Card>
            );
        });
    }

    return (<>
        {loggedIn ? 
            (<Row css={styles}>
                <Col xs={1} className="sidebar">
                    <Row><Button className="side-button"><Link to="/developers/anita"> <h2> Anita</h2> </Link></Button></Row>
                    <Row><Button className="side-button"><Link to="/developers/kristina"> <h2>Kristina</h2> </Link></Button></Row>
                    <Row><Button className="side-button"><Link to="/developers/thuyvy"> <h2> ThuyVy</h2> </Link></Button></Row>
                </Col>
                <Col xs={11}>
                    <Row>
                        <Col lg={3}>
                            {dev !== [] &&
                            (<Card className="dev-card">
                                <Card.Title> {dev.display_name} </Card.Title>
                                <Card.Img src={imageSrc[developer]} className="dev-image" />
                                {dev.followers && dev.followers.total && (<Card.Text> {dev.followers.total} Followers </Card.Text>)}
                            </Card>)}
                        </Col>
                        <Col lg={9}>
                            <h3>{dev.display_name}'s Playlists</h3>
                            {devPlaylists !== [] ? <Row>{displayPlaylists()}</Row> : <p>"Loading playlists..."</p>}
                        </Col>
                    </Row>
                </Col>
            </Row>) 
            : 
            (<div>
                <h5>Please login to use this feature!</h5>
                <SpotifyAuth
                    redirectUri='http://localhost:3000/redirect'
                    clientID='164e3321d4714ea2b1d88976aeecb258'
                    scopes={[Scopes.userReadPrivate, Scopes.userReadEmail]}
                />
            </div>)
        }
    </>);
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
        <Container fluid css={styles}>
            <Switch>
                <Route path={`${path}/:developer`}>
                    <Developer />
                </Route>
                <Route exact path={path}>
                    <Row>
                    <Col></Col>
                    <Col xs={7}>
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
                    </Col>
                    <Col></Col>
                    </Row>
                </Route>
            </Switch>
        </Container>
    </>
    );
  }

  export default Developers;