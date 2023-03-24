import { Container, Nav, Navbar } from 'react-bootstrap';
import { FaGoogle, FaMicrosoft } from "react-icons/fa";

const Navigation = ({ onReset, onLoad, onSave, user }) => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>Exercise Planner</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={onReset}>Reset</Nav.Link>
                    </Nav>
                    {!user && (
                        <Nav>
                            <Nav.Link href="/.auth/login/google">
                                <FaGoogle /> Login with Google
                            </Nav.Link>
                            <Nav.Link href="/.auth/login/aad">
                                <FaMicrosoft /> Login with Microsoft
                            </Nav.Link>
                        </Nav>
                    )}
                    {user && (
                        <Nav>
                            <div className='text-light my-auto'>
                                Welcome, {user}!
                            </div>
                            <Nav.Link href="/.auth/logout">
                                Logout
                            </Nav.Link>
                        </Nav>)}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
