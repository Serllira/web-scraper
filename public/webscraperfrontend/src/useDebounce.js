import React, {useState, useEffect} from 'react';


export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        }, [value]
    );

    return debouncedValue;
}

//src: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci