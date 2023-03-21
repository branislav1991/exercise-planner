import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Calendar.css';

const Calendar = ({ greenDates, highlightDates, handleClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const highlightSet = new Set(highlightDates.map(date => new Date(date).toDateString()));
    const greenSet = new Set(greenDates.map(date => new Date(date).toDateString()));

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const generateCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const calendar = [];
        let day = 1;

        for (let i = 0; i < 6; i++) {
            const week = [];

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfMonth) {
                    week.push(<Col key={j}></Col>);
                } else if (day > daysInMonth) {
                    week.push(<Col key={j}></Col>);
                } else {
                    const date = new Date(year, month, day);
                    const now = new Date();
                    const isHighlighted = highlightSet.has(date.toDateString());
                    const isGreen = greenSet.has(date.toDateString());
                    const isToday = date.toDateString() === now.toDateString();
                    let btnVariant = isHighlighted ? '' : 'outline-';
                    btnVariant += isGreen ? 'success' : (isToday ? 'warning' : 'primary');
                    week.push(
                        <Col
                            key={j}
                        >
                            <Button className='cell' variant={btnVariant} disabled={!isHighlighted} onClick={(event) => handleClick(date)}>{day}</Button>
                        </Col>
                    );
                    day++;
                }
            }

            calendar.push(<Row key={i}>{week}</Row>);
        }

        return calendar;
    };

    const changeMonth = (delta) => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + delta, 1));
    };

    return (
        <>
            <Container>
                <Row className="text-center mb-3">
                    <Col>
                        <Button variant="link" onClick={() => changeMonth(-1)}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </Button>
                    </Col>
                    <Col>
                        <h4>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                    </Col>
                    <Col>
                        <Button variant="link" onClick={() => changeMonth(1)}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Container className='custom-grid'>
                <Row>
                    {daysOfWeek.map((day, idx) => (
                        <Col key={idx} className="text-center">
                            {day}
                        </Col>
                    ))}
                </Row>
                {generateCalendar()}
            </Container >
        </>
    );
};

export default Calendar;
