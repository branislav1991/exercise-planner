import React, { useState } from 'react';
import { Button, Row, Col, Container, Form, Stack } from 'react-bootstrap';
import RadioButtonGroup from './RadioButtonGroup';
import { FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

function Exercises({ selectedWorkout, onUpdate }) {
    const exerciseTypes = [
        'Pull-ups',
        'Chin-ups',
        'Dips',
        'Dead Bugs',
        'Cossack squats',
        'Split squats',
        'Side lunges',
        'High jumps',
        'Side plank rotations',
        'High plank rotations',
        'Russian twists',
        'Diamond pushups',
        'Leg raises',
        'Reverse crunches',
        'V-ups',
        'Supermans',
        'Inverted rows',
        'Glute bridges',
        'Plank leg lifts',
        'Skipping Jumps',
        'Burpees',
        'Squats',
        'Push Ups',
        'Sit Ups',
        'Plank',
        'Jumping Jacks',
        'Lunges',
        'Mountain Climbers',
        'Jump Squats',
        'Jumping Lunges',
        'Cat-Cow',
        'Down Dog to Cobra',
        'Assisted Standups',
        'Table Twists',
        'Climbers',
        'Bicep Curls',
        'Forearm Curls',
        'One-Arm Pushups',
        'Wide-grip pull-ups',
        'Single-leg glute bridges',
        'Hanging leg raises',
        'Muscle-ups',
        'Pistol squats',
        'Archer Pushups'];
    const exerciseSetOptions = [{ 'label': '1', 'value': '1' }, { 'label': '2', 'value': '2' }, { 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }];
    const exerciseRepsOptions = [{ 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }, { 'label': '8', 'value': '8' }, { 'label': '10', 'value': '10' }, { 'label': '12', 'value': '12' }, { 'label': '16', 'value': '16' }, { 'label': '20', 'value': '20' }, { 'label': '25', 'value': '25' }, { 'label': '30', 'value': '30' }, { 'label': '40', 'value': '40' }, { 'label': '50', 'value': '50' }];

    const [selectedExerciseType, setSelectedExerciseType] = useState('');
    const [selectedExerciseSet, setSelectedExerciseSet] = useState(null);
    const [selectedExerciseReps, setSelectedExerciseReps] = useState(null);

    const addExercise = () => {
        const newWorkout = { ...selectedWorkout, exercises: [...selectedWorkout.exercises, { id: uuidv4(), name: selectedExerciseType, sets: selectedExerciseSet, reps: selectedExerciseReps }] };
        onUpdate(newWorkout);
    };

    const removeExercise = (id) => {
        const newWorkout = { ...selectedWorkout, exercises: selectedWorkout.exercises.filter((ex) => ex.id !== id) };
        onUpdate(newWorkout);
    };

    const setWorkoutCompleted = () => {
        const newWorkout = { ...selectedWorkout, completed: !selectedWorkout.completed };
        onUpdate(newWorkout);
    }

    return (
        <Container className="border border-primary rounded mt-4 p-4">
            <Row className="align-items-center">
                <Col>
                    <h3>{selectedWorkout.name} - {selectedWorkout.date.toDateString()}</h3>
                </Col>
                <Col md="auto">
                    <Form.Check type="switch" id="workout-complete-switch" label="Completed" checked={selectedWorkout.completed} onChange={setWorkoutCompleted} />
                </Col>
            </Row>
            {
                !selectedWorkout.completed &&
                <Row className="mt-4 align-items-center">
                    <Col>
                        <Container className="border border-primary rounded p-4">
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Select value={selectedExerciseType} onChange={(event) => { setSelectedExerciseType(event.target.value) }}>
                                        <option key='blankExercise' hidden value=''> --Select exercise type-- </option>
                                        {exerciseTypes.map((exercise, index) => <option key={index}>{exercise}</option>)}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="mt-4 align-items-center">
                                <Col>Number of sets:</Col>
                                <Col>
                                    <RadioButtonGroup name="exerciseSets" options={exerciseSetOptions} selectedOption={selectedExerciseSet} handleChange={(event) => { setSelectedExerciseSet(event.target.value) }} />
                                </Col>
                            </Row>
                            <Row className="mt-4 align-items-center">
                                <Col>Number of reps:</Col>
                                <Col>
                                    <RadioButtonGroup name="exerciseReps" options={exerciseRepsOptions} selectedOption={selectedExerciseReps} handleChange={(event) => { setSelectedExerciseReps(event.target.value) }} />
                                </Col>
                            </Row>
                            <Row className="mt-4 align-items-center">
                                <Col>
                                    <Button variant="primary" disabled={selectedExerciseType === '' || selectedExerciseSet === null || selectedExerciseReps === null} onClick={addExercise}>Add Exercise</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            }
            <Row className="mt-4 align-items-center">
                <Col>
                    <Stack gap={3}>
                        {selectedWorkout.exercises.map((exercise, index) => (
                            <Stack direction='horizontal' gap={3} key={index}>
                                <span>{exercise.name} - {exercise.sets} Sets @ {exercise.reps} Reps</span>
                                {!selectedWorkout.completed &&
                                    <Button className='my-auto' variant="outline-danger" onClick={() => removeExercise(exercise.id)}><FaTrash /></Button>
                                }
                            </Stack>))}
                    </Stack>
                </Col>
            </Row>
        </Container >
    );
}

export default Exercises;
