const chartYLabels = Object.freeze({
    0.2: "Highly Above Average",
    0.1: "Above Average",
    0: "National Average",
    [-0.1]: "Below Average",
    [-0.2]: "Way Below Average"
});

const ChartIntervals = Object.freeze({
    1: { name: "Way Below Average", maxValue: -0.2 },
    2: { name: "Below Average", maxValue: -0.1 },
    3: { name: "Slightly Below Average", maxValue: -0.001 },
    4: { name: "National Average", maxValue: 0 },
    5: { name: "Slightly Above Average", maxValue: 0.099 },
    6: { name: "Above Average", maxValue: 0.199 },
    7: { name: "Highly Above Average", maxValue: Infinity },
});

const getChartInterval = (value) => {
    return Object.entries(ChartIntervals).find((interval) => {
        return value <= interval[1].maxValue;
    });
}