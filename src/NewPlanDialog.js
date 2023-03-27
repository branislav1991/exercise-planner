import React, { useState } from 'react';
import { Button, Row, Col, Container, Form } from 'react-bootstrap';
import RadioButtonGroup from './RadioButtonGroup';

function NewPlanDialog({ onCreate }) {
  const frequencyOptions = [{ 'label': '3x', 'value': '3' }, { 'label': '4x', 'value': '4' }, { 'label': '5x', 'value': '5' }];
  const planLengthOptions = [{ 'label': '8 Weeks', 'value': '8' }, { 'label': '12 Weeks', 'value': '12' }, { 'label': '16 Weeks', 'value': '16' }];

  const [selectedFrequency, setSelectedFrequency] = useState(frequencyOptions[0].value);
  const [selectedPlanLength, setSelectedPlanLength] = useState(planLengthOptions[0].value);
  const [startDate, setStartDate] = useState('');

  return (
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
          <Button variant="primary" disabled={startDate === ""} onClick={() => onCreate(parseInt(selectedPlanLength), parseInt(selectedFrequency), new Date(startDate))}>Create Plan</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NewPlanDialog;
