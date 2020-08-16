const getTooltip = (value) => {
    if (value >= 0.2) {
        return "Highly Above Average";
    } else if (value >= 0.1) {
        return "Above Average";
    } else if (value > 0) {
        return "Slightly Above Average";
    } else if (value === 0) {
        return "National Average";
    } else if (value > -0.1) {
        return "Slightly Below Average";
    } else if (value > -0.2) {
        return "Below Average";
    } else if (value <= -0.2) {
        return "Way Below Average"
    } else {
        return "";
    }
}

const yLabels = Object.freeze({
    0.2: "Highly Above Average",
    0.1: "Above Average",
    0: "National Average",
    [-0.1]: "Below Average",
    [-0.2]: "Way Below Average"
});