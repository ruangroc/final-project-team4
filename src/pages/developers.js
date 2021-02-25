/**@jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
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

    const row = css`
        text-align: center;
    `;

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