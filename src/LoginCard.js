import React from 'react';
import { Card, Button, Stack } from 'react-bootstrap';
import { FaMicrosoft, FaGoogle } from 'react-icons/fa';

const LoginCard = () => {
    return (
        <Card className='p-4'>
            <Card.Body>
                <Card.Title>Login with</Card.Title>
                <Stack direction="horizontal" gap={3}>
                    <Button
                        className="my-3"
                        variant="primary"
                        onClick={() => window.open('/.auth/login/aad', '_self')}
                    >
                        <FaMicrosoft /> Microsoft
                    </Button>
                    <Button
                        className="my-3"
                        variant="danger"
                        onClick={() => window.open('/.auth/login/google', '_self')}
                    >
                        <FaGoogle /> Google
                    </Button>
                </Stack>
            </Card.Body>
        </Card>
    );
};

export default LoginCard;