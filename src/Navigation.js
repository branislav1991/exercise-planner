import { Container, Nav, Navbar } from 'react-bootstrap';

const Navigation = ({ onReset, onLoad, onSave }) => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>Exercise Planner</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={onLoad}>Load</Nav.Link>
                        <Nav.Link onClick={onSave}>Save</Nav.Link>
                        <Nav.Link onClick={onReset}>Reset</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
