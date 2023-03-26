import React, { useEffect, useState } from 'react';
import { Alert, Button, Row, Col, Container, Form, Stack, Modal } from 'react-bootstrap';
import './App.css';
import RadioButtonGroup from './RadioButtonGroup';
import Calendar from './Calendar';
import Navigation from './Navigation';
import LoginCard from './LoginCard';
import LoadingCard from './LoadingCard';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash } from 'react-icons/fa';

function App() {
  const frequencyOptions = [{ 'label': '3x', 'value': '3' }, { 'label': '4x', 'value': '4' }, { 'label': '5x', 'value': '5' }]
  const planLengthOptions = [{ 'label': '8 Weeks', 'value': '8' }, { 'label': '12 Weeks', 'value': '12' }, { 'label': '16 Weeks', 'value': '16' }]
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
    'Archer Pushups']
  const exerciseSetOptions = [{ 'label': '1', 'value': '1' }, { 'label': '2', 'value': '2' }, { 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }]
  const exerciseRepsOptions = [{ 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }, { 'label': '8', 'value': '8' }, { 'label': '10', 'value': '10' }, { 'label': '12', 'value': '12' }, { 'label': '16', 'value': '16' }, { 'label': '20', 'value': '20' }, { 'label': '25', 'value': '25' }, { 'label': '30', 'value': '30' }, { 'label': '40', 'value': '40' }, { 'label': '50', 'value': '50' }]

  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState(frequencyOptions[0].value);
  const [selectedPlanLength, setSelectedPlanLength] = useState(planLengthOptions[0].value);
  const [startDate, setStartDate] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExerciseType, setSelectedExerciseType] = useState('');
  const [selectedExerciseSet, setSelectedExerciseSet] = useState(null);
  const [selectedExerciseReps, setSelectedExerciseReps] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        if (clientPrincipal) {
          setUserId(clientPrincipal.userId);
          setUserName(clientPrincipal.userDetails);

          // Load workouts for user
          setLoadingWorkouts(true);
        }
      } catch (error) {
        setErrorMessage('Could not load user data. Please try again later.');
        setShowError(true);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userId) {
      // Get all workouts for user
      const getWorkouts = async () => {
        const gql = `
        {
          workouts(filter: {userId: {eq: "${userId}"}}) {
            items {
              id
              name
              key
              userId
              date
              completed
              exercises
            }
          }
        }`;

        try {
          const endpoint = "/data-api/graphql";
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: gql })
          });
          const result = await response.json();
          const userWorkouts = result.data.workouts.items;

          // Convert exercises strings to objects
          const userExercises = [];
          userWorkouts.forEach((workout) => {
            workout.date = new Date(workout.date);
            const workoutExercises = JSON.parse(workout.exercises);
            userExercises.push(...workoutExercises);
            delete workout.exercises;
          });

          setWorkouts(userWorkouts);
          setExercises(userExercises);
          setSelectedWorkout(null);
          setLoadingWorkouts(false);
        } catch (error) {
          setErrorMessage('Could not load user workouts. Please try again later.');
          setShowError(true);
        }
      };
      getWorkouts();
    }
  }, [userId]);

  const createWorkoutInDb = async (workout) => {
    const gql = `
      mutation create($item: CreateWorkoutInput!) {
        createWorkout(item: $item) {
          id
          name
          key
          userId
          date
          completed
          exercises
        }
      }`;

    // Find all exercises in the workout and add them to the workout object
    const workoutExercises = exercises.filter((exercise) => exercise.workoutId === workout.id);
    workout.exercises = JSON.stringify(workoutExercises);

    const query = {
      query: gql,
      variables: {
        item: workout
      }
    };

    try {
      const endpoint = "/data-api/graphql";
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
      });
    } catch (error) {
      setErrorMessage('Could not sync workouts with the server. Please try again later.');
      setShowError(true);
    }
  };

  const updateWorkout = async (workout, exercises) => {
    const workoutCopy = { ...workout };
    const id = workoutCopy.id
    workoutCopy.exercises = JSON.stringify(exercises.filter((exercise) => exercise.workout === workoutCopy.id));

    const gql = `
        mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdateWorkoutInput!) {
          updateWorkout(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
            id
            name
            key
            userId
            date
            completed
            exercises
          }
        }`;

    const query = {
      query: gql,
      variables: {
        id: id,
        _partitionKeyValue: id,
        item: workoutCopy
      }
    };

    try {
      const endpoint = "/data-api/graphql";
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
      });
    } catch (error) {
      setErrorMessage('Could not sync workouts with the server. Please try again later.');
      setShowError(true);
    }
  };

  const deleteAllWorkouts = () => {
    workouts.forEach(async (workout) => {
      const gql = `
        mutation del($id: ID!, $_partitionKeyValue: String!) {
          deleteWorkout(id: $id, _partitionKeyValue: $_partitionKeyValue) {
            id
          }
        }`;

      const query = {
        query: gql,
        variables: {
          id: workout.id,
          _partitionKeyValue: workout.id
        }
      };

      try {
        const endpoint = "/data-api/graphql";
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query)
        });
      } catch (error) {
        setErrorMessage('Could not sync workouts with the server. Please try again later.');
        setShowError(true);
      }
    });
  }

  const createPlan = () => {
    let newWorkouts = [];
    const selectedPlanLengthInt = parseInt(selectedPlanLength);
    const selectedFrequencyInt = parseInt(selectedFrequency);
    for (let i = 0; i < selectedPlanLengthInt * selectedFrequencyInt; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i * 7 / selectedFrequencyInt);
      currentDate.setHours(0, 0, 0, 0);
      newWorkouts.push({ id: uuidv4(), userId: userId, name: `Workout ${i + 1}`, key: `workout-${i + 1}`, date: currentDate, completed: false });
    }
    setWorkouts(newWorkouts);

    if (userId) {
      newWorkouts.forEach((workout) => createWorkoutInDb(workout));
    }
  };

  const addExercise = () => {
    const newExercises = [...exercises, { id: uuidv4(), name: selectedExerciseType, workout: selectedWorkout.id, sets: selectedExerciseSet, reps: selectedExerciseReps }];
    setExercises(newExercises);

    if (userId) {
      updateWorkout(selectedWorkout, newExercises);
    }
  };

  const removeExercise = (id) => {
    const newExercises = exercises.filter((ex) => ex.id !== id);
    setExercises(newExercises);

    if (userId) {
      updateWorkout(selectedWorkout, newExercises);
    }
  };

  const setWorkoutCompleted = () => {
    const newWorkouts = workouts.map((workout) => {
      if (workout.id === selectedWorkout.id) {
        return { ...workout, completed: !workout.completed };
      }
      else {
        return workout;
      }
    });
    setWorkouts(newWorkouts);
    const newSelectedWorkout = newWorkouts.find((workout) => workout.id === selectedWorkout.id);
    setSelectedWorkout(newSelectedWorkout);

    if (userId) {
      updateWorkout(newSelectedWorkout, exercises);
    }
  }

  return (
    <>
      <Modal show={showReset} onHide={() => setShowReset(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to reset the plan?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReset(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            if (userId) {
              deleteAllWorkouts();
            }

            setWorkouts([]);
            setExercises([]);
            setSelectedWorkout(null);
            setShowReset(false);
          }}>
            Reset
          </Button>
        </Modal.Footer>
      </Modal>

      {
        !userId &&
        <Container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <LoginCard />
        </Container>
      }

      {userId && loadingWorkouts &&
        <Container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <LoadingCard />
        </Container>
      }

      {userId && !loadingWorkouts &&
        <Navigation user={userName} onReset={() => { setShowReset(true); }} />
      }

      <Alert className='rounded-0' key='file-save-alert' variant='danger' show={showError} onClose={() => setShowError(false)} dismissible>
        <Alert.Heading>Error</Alert.Heading>
        {errorMessage}
      </Alert>

      {userId && !loadingWorkouts && workouts.length === 0 &&
        <Container className="border border-primary rounded mt-4 p-4">
          <Row className="align-items-center">
            <Col>Workout frequency:</Col>
            <Col>
              <RadioButtonGroup name="frequency" options={frequencyOptions} selectedOption={selectedFrequency} handleChange={(event) => { setSelectedFrequency(event.target.value) }} />
            </Col>
          </Row>
          <Row className="mt-4 align-items-center">
            <Col>Plan length:</Col>
            <Col>
              <RadioButtonGroup name="planLength" options={planLengthOptions} selectedOption={selectedPlanLength} handleChange={(event) => { setSelectedPlanLength(event.target.value) }} />
            </Col>
          </Row>
          <Row className="mt-4 align-items-center">
            <Col>Starting date:</Col>
            <Col>
              <Form.Control type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </Col>
          </Row>
          <Row className="mt-4 align-items-center">
            <Col>
              <Button variant="primary" disabled={startDate === ""} onClick={createPlan}>Create Plan</Button>
            </Col>
          </Row>
        </Container>
      }

      {userId && !loadingWorkouts && workouts.length > 0 &&
        <Container className="border border-primary rounded mt-4 p-4">
          <Calendar highlightDates={workouts.map((workout) => workout.date)} greenDates={workouts.map((workout) => workout.completed ? workout.date : null)} handleClick={(date) => { setSelectedWorkout(workouts.find((workout) => workout.date.toDateString() === date.toDateString())) }} />
        </Container>
      }

      {selectedWorkout &&
        <Container className="border border-primary rounded mt-4 p-4">
          <Row className="align-items-center">
            <Col>
              <h3>{selectedWorkout.name} - {selectedWorkout.date.toDateString()}</h3>
            </Col>
            <Col md="auto">
              <Form.Check type="switch" id="workout-complete-switch" label="Completed" checked={selectedWorkout.completed} onChange={setWorkoutCompleted} />
            </Col>
          </Row>
          {!selectedWorkout.completed &&
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
                {exercises.map((exercise, index) => (exercise.workout === selectedWorkout.id) ?
                  <Stack direction='horizontal' gap={3} key={index}>
                    <span>{exercise.name} - {exercise.sets} Sets @ {exercise.reps} Reps</span>
                    <Button className='my-auto' variant="outline-danger" onClick={() => removeExercise(exercise.id)}><FaTrash /></Button>
                  </Stack> : null)}
              </Stack>
            </Col>
          </Row>
        </Container>
      }
    </>
  );
}

export default App;
