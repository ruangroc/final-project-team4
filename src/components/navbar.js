import React from "react";
import { Nav, Navbar } from "react-bootstrap";

export default function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">Spotify Interactive</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Nav.Link href="/userstats">cat-ify yourself</Nav.Link>
          <Nav.Link href="/combineplaylists">conCAT playlists</Nav.Link>
          <Nav.Link href="/developers">about</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
