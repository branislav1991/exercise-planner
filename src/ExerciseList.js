import React, { useState } from 'react';
import { ListGroup, Button, Stack } from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaTrash } from 'react-icons/fa';

const ExerciseList = ({ exercises, onRemove, onDragEnd, dragDisabled }) => {
  const [hoveringId, setHoveringId] = useState(null);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="exercises">
        {(provided) => (
          <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
            {exercises.map((exercise, index) => (
              <Draggable key={exercise.id} draggableId={exercise.id} index={index} isDragDisabled={dragDisabled}>
                {(provided) => (
                  <ListGroup.Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    active={hoveringId === exercise.id && !dragDisabled}
                    variant={exercise.isGroupHeader ? 'secondary' : 'light'}
                    onMouseEnter={() => setHoveringId(exercise.id)}
                    onMouseLeave={() => setHoveringId(null)}
                  >
                    <Stack direction="horizontal" gap={3}>
                      {('isGroupHeader' in exercise) && exercise.isGroupHeader &&
                        <h4 className='my-auto'>{exercise.name}</h4>
                      }
                      {(!('isGroupHeader' in exercise) || !exercise.isGroupHeader) &&
                        <span>{exercise.name} - {exercise.sets} Sets @ {exercise.reps} Reps</span>
                      }
                      {!dragDisabled &&
                        <Button className='ms-auto' variant="danger" onClick={() => onRemove(exercise.id)}>
                          <FaTrash />
                        </Button>
                      }
                    </Stack>
                  </ListGroup.Item>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ListGroup>
        )}
      </Droppable>
    </DragDropContext >
  );
};

export default ExerciseList;
