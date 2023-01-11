import React from "react";
import { Nav, Navbar } from "react-bootstrap";

export default function Navigation() {
  return (
    <Navbar
      bg="dark"
      variant="light"
      expand="lg"
      style={{
        backgroundImage: "url('background.jpeg')",
        fontWeight: "bold",
        color: "white",
        fontFamily: "Coiny",
      }}
    >
      <Navbar.Brand
        style={{
          fontWeight: "bold",
          color: "white",
          fontSize: "x-large",
        }}
        href="/"
      >
        unpaws the music
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Nav.Link href="/userstats">spotify purrsona</Nav.Link>
          <Nav.Link href="/combineplaylists">concat playlists</Nav.Link>
          <Nav.Link href="/developers">about</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
