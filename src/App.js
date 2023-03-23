import React, { useEffect, useState } from 'react';
import { Alert, Button, Row, Col, Container, Form, Stack, Modal } from 'react-bootstrap';
import './App.css';
import RadioButtonGroup from './RadioButtonGroup';
import Calendar from './Calendar';
import Navigation from './Navigation';

function App() {
  const frequencyOptions = [{ 'label': '3x', 'value': '3' }, { 'label': '4x', 'value': '4' }, { 'label': '5x', 'value': '5' }]
  const planLengthOptions = [{ 'label': '8 Weeks', 'value': '8' }, { 'label': '12 Weeks', 'value': '12' }, { 'label': '16 Weeks', 'value': '16' }]
  const exerciseTypes = ['Skipping Jumps', 'Burpees', 'Squats', 'Push Ups', 'Sit Ups', 'Plank', 'Jumping Jacks', 'Lunges', 'Mountain Climbers', 'Jump Squats', 'Jumping Lunges', 'Cat-Cow', 'Down Dog to Cobra', 'Assisted Standups', 'Table Twists', 'Climbers']
  const exerciseSetOptions = [{ 'label': '1', 'value': '1' }, { 'label': '2', 'value': '2' }, { 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }]
  const exerciseRepsOptions = [{ 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }, { 'label': '8', 'value': '8' }, { 'label': '10', 'value': '10' }, { 'label': '12', 'value': '12' }, { 'label': '16', 'value': '16' }, { 'label': '20', 'value': '20' }, { 'label': '25', 'value': '25' }, { 'label': '30', 'value': '30' }, { 'label': '40', 'value': '40' }, { 'label': '50', 'value': '50' }]

  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState({});
  const [selectedFrequency, setSelectedFrequency] = useState(frequencyOptions[0].value);
  const [selectedPlanLength, setSelectedPlanLength] = useState(planLengthOptions[0].value);
  const [startDate, setStartDate] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExerciseType, setSelectedExerciseType] = useState('');
  const [selectedExerciseSet, setSelectedExerciseSet] = useState(null);
  const [selectedExerciseReps, setSelectedExerciseReps] = useState(null);
  const [showFileOpenAlert, setShowFileOpenAlert] = useState(false);
  const [showFileSaveAlert, setShowFileSaveAlert] = useState(false);
  const [showReset, setShowReset] = useState(false);
  // const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        if (clientPrincipal) {
          // setUserId(clientPrincipal.userId);
          setUserName(clientPrincipal.userDetails)
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();

    const list = async () => {
      const query = `
      {
        people {
          items {
            id
            Name
          }
        }
      }`;

      const endpoint = "/data-api/graphql";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      console.table(result.data.people.items);
    };
    list();
  }, []);

  const createPlan = () => {
    let newWorkouts = {};
    const selectedPlanLengthInt = parseInt(selectedPlanLength);
    const selectedFrequencyInt = parseInt(selectedFrequency);
    for (let i = 0; i < selectedPlanLengthInt * selectedFrequencyInt; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i * 7 / selectedFrequencyInt);
      currentDate.setHours(0, 0, 0, 0);
      newWorkouts[currentDate] = { name: `Workout ${i + 1}`, key: `workout-${i + 1}`, date: currentDate, completed: false, exercises: [] }
    }
    setWorkouts(newWorkouts);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: selectedExerciseType, workout: selectedWorkout.name, sets: selectedExerciseSet, reps: selectedExerciseReps }]);
  };

  const setWorkoutCompleted = () => {
    const newWorkouts = { ...workouts };
    newWorkouts[selectedWorkout.date].completed = !newWorkouts[selectedWorkout.date].completed;
    setWorkouts(newWorkouts);
    setSelectedWorkout(selectedWorkout);
  }

  const loadPlanFromFile = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({ types: [{ description: 'Exercise Planner Files', accept: { 'application/json': ['.json'] } }] });
      const file = await fileHandle.getFile();
      const text = await file.text();
      const plan = JSON.parse(text);
      Object.keys(plan.workouts).forEach((key) => {
        plan.workouts[key].date = new Date(plan.workouts[key].date);
      })
      setWorkouts(plan.workouts);
      setExercises(plan.exercises);
      setSelectedWorkout(null);
    } catch (e) {
      setShowFileOpenAlert(true);
      console.log(e);
    }
  }

  const savePlanToFile = async () => {
    try {
      const plan = { workouts, exercises };
      const fileHandle = await window.showSaveFilePicker({
        types: [{
          description: 'Exercise Planner Files',
          accept: {
            'application/json': ['.json'],
          },
        }],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(plan));
      await writable.close();
    } catch (e) {
      setShowFileSaveAlert(true);
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
            setWorkouts({});
            setExercises([]);
            setSelectedWorkout(null);
            setShowReset(false);
          }}>
            Reset
          </Button>
        </Modal.Footer>
      </Modal>

      <Navigation user={userName} onReset={() => { setShowReset(true); }} onLoad={loadPlanFromFile} onSave={savePlanToFile} />
      <Alert className='rounded-0' key='file-open-alert' variant='danger' show={showFileOpenAlert} onClose={() => setShowFileOpenAlert(false)} dismissible>
        <Alert.Heading>Error opening file</Alert.Heading>
        Please check if the file you are trying to load was saved using the exercise planner
      </Alert>
      <Alert className='rounded-0' key='file-save-alert' variant='danger' show={showFileSaveAlert} onClose={() => setShowFileSaveAlert(false)} dismissible>
        <Alert.Heading>Error saving file</Alert.Heading>
        Please try again
      </Alert>

      {
        Object.keys(workouts).length === 0 &&
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
      {
        Object.keys(workouts).length > 0 &&
        <Container className="border border-primary rounded mt-4 p-4">
          <Calendar highlightDates={Object.entries(workouts).map(([date, workout]) => date)} greenDates={Object.entries(workouts).map(([date, workout]) => workout.completed ? date : null)} handleClick={(date) => setSelectedWorkout(workouts[date])} />
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
                {exercises.map((exercise, index) => (exercise.workout === selectedWorkout.name) ? <div key={index}>{exercise.name} - {exercise.sets} Sets @ {exercise.reps} Reps</div> : null)}
              </Stack>
            </Col>
          </Row>
        </Container>
      }
    </>
  );
}

export default App;

