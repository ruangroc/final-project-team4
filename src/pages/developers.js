/**@jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import {Container, Row, Col, Card} from 'react-bootstrap';
import {css} from '@emotion/react';
import {Route,Switch,useParams,useRouteMatch, Redirect, Link} from 'react-router-dom';
import { get } from '../utils/api';


function Developer() {
    const {developer} = useParams();
    const { url, path } = useRouteMatch();
    const [dev, setDev] = useState([]);
    
    if(developer == "thuyvy"){
        fetchspotifyuser("tweetynguy");
    }else if(developer == "kristina"){
        fetchspotifyuser("kxlee14");
    }else if(developer == "anita"){
        fetchspotifyuser("anitasmith98");
    }else{
        return <Redirect to="/error" />
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
      </div>
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
                                <Card.Text><Link to="/developers/anita"> <h2> Anita</h2> </Link></Card.Text>
                            </Card>  
                        </Col>
                        <Col>
                            <Card className="row">
                                <Card.Img className="image" src="https://i.imgur.com/xPy88y5.png" />
                                <Card.Text><Link to="/developers/kristina"> <h2>Kristina</h2> </Link></Card.Text>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="row">
                                <Card.Img className="image" src="http://allaboutcat.org/wp-content/uploads/2017/09/cat-sticking-tongue-out-2.jpg" />
                                <Card.Text><Link to="/developers/thuyvy"> <h2> ThuyVy</h2> </Link></Card.Text>
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