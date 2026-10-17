import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';

interface Option {
    label: string;
    value: string;
    id: string;
}

interface CustomSelectProps {
    options: Option[];
    value?: Option | null;
    onChange: (option: Option) => void;
    placeholder?: string;
    isOpen: boolean;
    onToggle: () => void;
    isActive: boolean;
    deviceType: string;
    onNavigateUp?: () => void;
    onNavigateDown?: () => void;
    onSelect?: () => void;
}

interface CustomSelectRef {
    selectHighlighted: () => void;
    navigateUp: () => void;
    navigateDown: () => void;
    getCurrentHighlighted: () => Option | null;
}

export const CustomSelect = React.forwardRef<CustomSelectRef, CustomSelectProps>(({
    options,
    value,
    onChange,
    placeholder = "Select option",
    isOpen,
    onToggle,
    isActive,
    deviceType
}, ref) => {
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Ensure highlighted index is always valid when options change
    useEffect(() => {
        if (options.length > 0) {
            setHighlightedIndex(prev => Math.min(prev, options.length - 1));
        }
    }, [options]);

    // Reset highlighted index when menu opens
    useEffect(() => {
        if (isOpen && options.length > 0) {
            const currentIndex = value ? options.findIndex(opt => opt.id === value.id) : 0;
            const validIndex = currentIndex >= 0 ? currentIndex : 0;
            console.log('Menu opened - setting highlighted index to:', validIndex, 'for value:', value?.label);
            setHighlightedIndex(validIndex);
        }
    }, [isOpen, value]);

    // Scroll highlighted option into view
    useEffect(() => {
        if (isOpen && optionsRef.current[highlightedIndex]) {
            optionsRef.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [highlightedIndex, isOpen]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        selectHighlighted: () => {
            const validIndex = Math.max(0, Math.min(highlightedIndex, options.length - 1));
            const selectedOption = options[validIndex];

            console.log('Selecting highlighted option:', selectedOption, 'at index:', validIndex);

            if (selectedOption) {
                onChange(selectedOption);
            }
        },

        navigateUp: () => {
            setHighlightedIndex(prev => {
                const newIndex = prev > 0 ? prev - 1 : prev;
                console.log('UP - Moving from index', prev, 'to', newIndex);
                return newIndex;
            });
        },

        navigateDown: () => {
            setHighlightedIndex(prev => {
                const newIndex = prev < options.length - 1 ? prev + 1 : prev;
                console.log('DOWN - Moving from index', prev, 'to', newIndex);
                return newIndex;
            });
        },

        getCurrentHighlighted: () => {
            const validIndex = Math.max(0, Math.min(highlightedIndex, options.length - 1));
            return options[validIndex] || null;
        }
    }), [highlightedIndex, options, onChange]);

    const handleOptionClick = (option: Option, index: number) => {
        console.log('Option clicked:', option, 'at index:', index);
        setHighlightedIndex(index);
        onChange(option);
        onToggle();
    };

    const handleSelectClick = () => {
        onToggle();
    };

    return (
        <div
            className="custom-select"
            ref={selectRef}
            style={{
                position: 'relative',
                width: '36rem'
            }}
        >
            {/* Select Control */}
            <div
                className="custom-select__control"
                onClick={handleSelectClick}
                style={{
                    border: '.2rem solid transparent',
                    borderColor: isActive ? 'var(--active-color, var(--initial-active-color))' : 'transparent',
                    boxShadow: 'none',
                    width: '100%',
                    fontSize: '3rem',
                    borderRadius: '.8rem',
                    background: 'black',
                    color: 'white',
                    padding: '1rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: deviceType === 'TV' ? 'default' : 'pointer',
                    position: 'relative',
                    minHeight: '5rem'
                }}
            >
                <span style={{
                    color: 'white',
                    fontWeight: 500,
                    flex: 1,
                    textAlign: 'left'
                }}>
                    {value?.label || placeholder}
                </span>

                {/* Dropdown Arrow */}
                <div
                    style={{
                        marginLeft: '1rem',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        color: 'white',
                        fontSize: '2rem'
                    }}
                >
                    ▼
                </div>
            </div>

            {/* Options Menu */}
            {isOpen && (
                <div
                    className="custom-select__menu"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        left: 0,
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.95)',
                        border: '.2rem solid #333',
                        borderRadius: '.8rem',
                        zIndex: 1000,
                        maxHeight: '25rem',
                        overflowY: 'auto',
                        width: '100%',
                        backdropFilter: 'blur(1rem)',
                        boxShadow: '0 .8rem 3.2rem rgba(0, 0, 0, 0.8)'
                    }}
                >
                    {options.map((option, index) => (
                        <div
                            key={option.id}
                            ref={el => optionsRef.current[index] = el}
                            className="custom-select__option"
                            onClick={() => handleOptionClick(option, index)}
                            style={{
                                padding: '1.5rem 2rem',
                                fontSize: '2.5rem',
                                color: index === highlightedIndex ? 'white' : '#ccc',
                                backgroundColor: index === highlightedIndex ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                border: index === highlightedIndex ? '.1rem solid rgba(255, 255, 255, 0.3)' : '.1rem solid transparent',
                                cursor: deviceType === 'TV' ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                borderBottom: index < options.length - 1 ? '.1rem solid rgba(255, 255, 255, 0.1)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                minHeight: '4rem',
                                position: 'relative'
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {index === highlightedIndex && (
                                <span style={{
                                    marginRight: '1rem',
                                    color: 'white',
                                    fontSize: '2rem'
                                }}>
                                    ►
                                </span>
                            )}
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

CustomSelect.displayName = 'CustomSelect';
