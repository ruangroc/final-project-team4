/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import {css} from '@emotion/react';


function Developers() {
    const row = css`
        text-align: center;
    `;

    return (
        <>
        <Navigation/>
        <Container fluid>
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
        </Container>
    </>
    );
  }

  export default Developers;