// FILE: animation_chart.js

function start_animation_chart(containerId) {
    const container = document.getElementById(containerId);
    const canvasChart = document.createElement('canvas');
    container.appendChild(canvasChart);
    const ctxChart = canvasChart.getContext('2d');
    canvasChart.width = container.clientWidth;
    canvasChart.height = container.clientHeight;

    const chartData = [];
    const maxDataPoints = 50;
    let candleSize = canvasChart.height * 0.2; // Candlestick size relative to the canvas height
    let lastClose = canvasChart.height * 0.1; // Starting point for the close value
    let trend = 1; // Initial trend is upwards

    function generateRandomCandlestick() {
        const open = lastClose;
        // Randomly reverse the trend
        if (Math.random() < 0.2) {
            trend *= -1;
        }
        // calculate the next close value based on the trend and visually multiply by candleSize
        const noise = Math.pow(Math.random(), 2) * candleSize;
        let trend_factor = trend;
        if (Math.random() < 0.35) { // 35% chance to go against trend
            trend_factor *= -1;
        }
        // control trend to stay inside canvas
        if (open > canvasChart.height * 0.9) {
            trend_factor = -1;
        } else if (open < canvasChart.height * 0.1) {
            trend_factor = 1;
        }
        const close = open + trend_factor * noise;
        const high = Math.min(Math.max(open, close) + candleSize/2 * Math.pow(Math.random(), 2), 0.99 * canvasChart.height);
        const low = Math.max(Math.min(open, close) - candleSize/2 * Math.pow(Math.random(), 2), 0.01 * canvasChart.height);
        lastClose = close;
        return { open, close, high, low };
    }

    function drawChart() {
        ctxChart.clearRect(0, 0, canvasChart.width, canvasChart.height);

        const candleWidth = canvasChart.width / maxDataPoints;
        chartData.forEach((data, index) => {
            const x = index * candleWidth;
            const color = data.close > data.open ? 'rgba(119, 221, 118, 1)' : 'rgba(255, 105, 98, 1)';
            ctxChart.fillStyle = color;
            ctxChart.fillRect(x, canvasChart.height - data.close, candleWidth, data.close - data.open);
            ctxChart.strokeStyle = color;
            ctxChart.beginPath();
            ctxChart.moveTo(x + candleWidth / 2, canvasChart.height - data.high);
            ctxChart.lineTo(x + candleWidth / 2, canvasChart.height - data.low);
            ctxChart.stroke();
        });

        requestAnimationFrame(drawChart);
    }

    function updateChartData() {
        if (chartData.length >= maxDataPoints) {
            chartData.shift();
        }
        chartData.push(generateRandomCandlestick());
        setTimeout(updateChartData, 100);
    }

    updateChartData();
    drawChart();
}