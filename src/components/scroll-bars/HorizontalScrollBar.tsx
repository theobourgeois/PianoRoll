import { useEffect, useState } from "react";
import { SIDEBAR_WIDTH } from "../../utils/constants";
import { ScrollBar, SCROLLBAR_SIZE } from "./ScrollBar";

const getRelativeDistanceAndKnobSize = (
    container: React.RefObject<HTMLDivElement>,
    gridWidth: number
) => {
    if (!container.current) return { distance: 0, knobSize: 0 };
    const knobSize = calculateKnobSize(container, gridWidth);
    const { scrollLeft, scrollWidth, offsetWidth } = container.current;
    let distance = (scrollLeft / scrollWidth) * offsetWidth;
    distance = Math.max(distance, 0);
    distance = Math.min(distance, offsetWidth - knobSize);
    return { distance, knobSize };
};

const calculateKnobSize = (
    container: React.RefObject<HTMLDivElement>,
    gridWidth: number
) => {
    const containerWidth = container.current?.clientWidth ?? 0;
    const visibleRatio = containerWidth / gridWidth;
    const newKnobSize = visibleRatio * containerWidth;
    return Math.max(newKnobSize, SIDEBAR_WIDTH);
};

interface HorizontalScrollBarProps {
    container: React.RefObject<HTMLDivElement>;
    gridWidth: number;
}

export const HorizontalScrollBar = ({
    container,
    gridWidth,
}: HorizontalScrollBarProps): JSX.Element => {
    const [distance, setDistance] = useState<number>(0);
    const [knobSize, setKnobSize] = useState<number>(SCROLLBAR_SIZE);

    // calculate the size of the knob based on the ratio of the visible area to the total area
    const handleDistanceChange = (distance: number, rect: DOMRect) => {
        if (!container.current) return;
        const { scrollWidth, offsetWidth } = container.current;
        const newKnobSize = calculateKnobSize(container, gridWidth);
        const scrollRatio = distance / rect.width;
        const newScrollPosition = scrollRatio * scrollWidth;
        let relativeDistance = scrollRatio * offsetWidth;
        relativeDistance = Math.max(
            0,
            Math.min(relativeDistance, offsetWidth - newKnobSize)
        );
        if (relativeDistance > offsetWidth - SIDEBAR_WIDTH / 2 - newKnobSize)
            return;
        setKnobSize(newKnobSize);
        setDistance(relativeDistance);
        container.current.scrollLeft = newScrollPosition;
    };

    const handleUpdateDistanceAndKnobSize = () => {
        const { distance, knobSize } = getRelativeDistanceAndKnobSize(
            container,
            gridWidth
        );
        setDistance(distance);
        setKnobSize(knobSize);
    };

    useEffect(() => {
        handleUpdateDistanceAndKnobSize();
    }, [gridWidth, container]);

    useEffect(() => {
        document.addEventListener("wheel", handleUpdateDistanceAndKnobSize);
        return () =>
            document.removeEventListener(
                "wheel",
                handleUpdateDistanceAndKnobSize
            );
    }, [container, gridWidth]);

    return (
        <ScrollBar
            distance={distance}
            onChange={handleDistanceChange}
            knobSize={knobSize}
            horizontal
        />
    );
};
