import { ToggleButton, ButtonGroup } from 'react-bootstrap';

const RadioButtonGroup = ({ options, name, selectedOption, handleChange }) => {
    return (
        <ButtonGroup>
            {options.map((option) =>
                <ToggleButton
                    id={`radio-${name}-${option.value}`}
                    type="radio"
                    variant='outline-primary'
                    label={option.label}
                    name={name}
                    value={option.value}
                    key={option.value}
                    checked={selectedOption === option.value}
                    onChange={handleChange}
                >
                    {option.label}
                </ToggleButton>
            )}
        </ButtonGroup>
    );
};

export default RadioButtonGroup;