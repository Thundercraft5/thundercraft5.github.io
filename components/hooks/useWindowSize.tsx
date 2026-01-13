import { useState, useEffect } from "react";

export default () => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        setSize({ width: window.innerWidth, height: window.innerHeight });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}