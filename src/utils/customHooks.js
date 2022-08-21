import { useState, useEffect } from "react";
import React from "react";
import { useLocation } from "react-router-dom";

export function useInput({ type, required, placeholder, ref, additionalFunc }) {
    const [value, setValue] = useState("");
    const input = (
        <input
            value={value}
            onChange={(e) => {
                if (additionalFunc){
                    additionalFunc()
                }
                setValue(e.target.value)}}
            type={type}
            ref={ref}
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

// https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
export const useOnScreen = (ref) => {
    const [isIntersecting, setIsIntersecting] = useState(false)

    const observer = new IntersectionObserver(
        ([entry]) => setIsIntersecting(entry.isIntersecting)
    )

    useEffect(() => {
        observer.observe(ref.current)
        return () => { observer.disconnect() }
    }, [])

    return isIntersecting
}