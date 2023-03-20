import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Container, Form, Stack, Modal } from 'react-bootstrap';
import './App.css';
import RadioButtonGroup from './RadioButtonGroup';
import Calendar from './Calendar';

function App() {
  const frequencyOptions = [{ 'label': '3x', 'value': '3' }, { 'label': '4x', 'value': '4' }, { 'label': '5x', 'value': '5' }]
  const planLengthOptions = [{ 'label': '8 Weeks', 'value': '8' }, { 'label': '12 Weeks', 'value': '12' }, { 'label': '16 Weeks', 'value': '16' }]
  const exerciseTypes = ['Skipping Jumps', 'Burpees', 'Squats', 'Push Ups', 'Sit Ups', 'Plank', 'Jumping Jacks', 'Lunges', 'Mountain Climbers', 'Jump Squats', 'Jumping Lunges', 'Cat-Cow', 'Down Dog to Cobra', 'Assisted Standups', 'Table Twists', 'Climbers']
  const exerciseSetOptions = [{ 'label': '1', 'value': '1' }, { 'label': '2', 'value': '2' }, { 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }]
  const exerciseRepsOptions = [{ 'label': '3', 'value': '3' }, { 'label': '4', 'value': '4' }, { 'label': '5', 'value': '5' }, { 'label': '6', 'value': '6' }, { 'label': '8', 'value': '8' }, { 'label': '10', 'value': '10' }, { 'label': '12', 'value': '12' }, { 'label': '16', 'value': '16' }, { 'label': '20', 'value': '20' }, { 'label': '25', 'value': '25' }, { 'label': '30', 'value': '30' }, { 'label': '40', 'value': '40' }, { 'label': '50', 'value': '50' }]

  const [exercises, setExercises] = useState(() => {
    const exercisesLocal = window.localStorage.getItem('exercises');
    if (exercisesLocal !== null) {
      return JSON.parse(exercisesLocal);
    }
    return [];
  });
  const [workouts, setWorkouts] = useState(() => {
    const workoutsLocal = window.localStorage.getItem('workouts');
    if (workoutsLocal !== null) {
      const workoutsParsed = JSON.parse(workoutsLocal);
      Object.keys(workoutsParsed).forEach((key) => {
        workoutsParsed[key].date = new Date(workoutsParsed[key].date);
      })
      return workoutsParsed;
    }
    return {};
  });
  const [selectedFrequency, setSelectedFrequency] = useState(frequencyOptions[0].value);
  const [selectedPlanLength, setSelectedPlanLength] = useState(planLengthOptions[0].value);
  const [startDate, setStartDate] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExerciseType, setSelectedExerciseType] = useState('');
  const [selectedExerciseSet, setSelectedExerciseSet] = useState(null);
  const [selectedExerciseReps, setSelectedExerciseReps] = useState(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('exercises', JSON.stringify(exercises));
    window.localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [exercises, workouts]);

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

      <h1 className="text-center mt-4">Workout Planner</h1>
      {Object.keys(workouts).length === 0 &&
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
      {Object.keys(workouts).length > 0 &&
        <Container className="border border-primary rounded mt-4 p-4">
          <Row className="align-items-center">
            <Col>
              <Calendar highlightDates={Object.entries(workouts).map(([date, workout]) => date)} greenDates={Object.entries(workouts).map(([date, workout]) => workout.completed ? date : null)} handleClick={(date) => setSelectedWorkout(workouts[date])} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="danger" className="mt-4" onClick={() => {
                setShowReset(true);
              }}>Reset</Button>
            </Col>
          </Row>
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

