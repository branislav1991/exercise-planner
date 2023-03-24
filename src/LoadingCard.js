import React from 'react';
import { Card, Spinner } from 'react-bootstrap';

const LoadingCard = () => {
    return (
        <Card className='p-4 text-center'>
            <Card.Body>
                <Card.Title>Loading Workouts</Card.Title>
                <Spinner className='mt-3 mx-auto' animation='border' role='status' variant='primary'>
                    <span className="visually-hidden">Loading workouts...</span>
                </Spinner>
            </Card.Body>
        </Card>
    );
};

export default LoadingCard;