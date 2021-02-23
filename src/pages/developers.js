/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import {css} from '@emotion/react';
import {
    Route,
    Switch,
    Link,
    NavLink,
    Redirect,
    useParams,
    useRouteMatch
  } from 'react-router-dom';

function Developer() {
    const {developer} = useParams();
    const { url, path } = useRouteMatch();

    return (
      <div>
        <h2> Developer's Name </h2> 
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
                            <h2> Anita</h2>
                        </Col>
                        <Col>
                            <h2> Kristina</h2>
                        </Col>
                        <Col>
                            <h2> ThuyVy</h2>
                        </Col>
                    </Row>
                </Route>
            </Switch>
        </Container>
    </>
    );
  }

  export default Developers;