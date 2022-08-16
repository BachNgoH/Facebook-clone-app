import { useState, useEffect } from "react";
import React from "react";
import { useLocation } from "react-router-dom";

export function useInput({ type, required, placeholder }) {
    const [value, setValue] = useState("");
    const input = (
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type={type}
            required={required ? required : true}
            placeholder={placeholder ? placeholder : null}
        />
    );
    return [value, input, setValue];
}

export function useResizeableInput({placeholder}) {
    const [value, setValue] = useState("");
    const handleKeyDown = (e) => {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };
    const input = (
        <textarea
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            value={value}
            placeholder={placeholder}
        ></textarea>
    );

    return [value, input, setValue]
}

// Source: https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
export function useClickOutsideDetector(ref, func) {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                func();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, func]);
}

export const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
