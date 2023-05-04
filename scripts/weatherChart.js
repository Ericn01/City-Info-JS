// ==================================== WEATHER CHART ============================

// This function uses the Chart.JS libary to generate a week forecast at the given location.
function makeWeatherChart(minData, maxData, dayData){
    const context = document.querySelector("#weather-chart").getContext('2d');
    const labels = formatChartWeekdays(); // Returns an array of days in the format: M D
    const chartOptions = {
        scales : {
            y: {
                ticks: {
                    color: "white"
                },
                title: {
                    align: "center",
                    color: "white"
                }
            },
            x: {
                ticks: {
                    color: "white"
                }
            }
        },
        plugins: {
            legend: {
                labels: {color: "white"},    
            }
        }
    }
    const data = {
        labels: labels,
        datasets: [{
            label: 'Day Temperature',
            data: dayData,
            fill: false,
            tension: 0.1
        },
        {
            label: 'Max Temperature',
            data: maxData,
            fill: false,
            tension: 0.1
        },
        {
            label: 'Min Temperature',
            data: minData,
            fill: false,
            tension: 0.1  
        }
        ]
    };
    const chartConfig = {type: 'line', data:data, options: chartOptions};
    new Chart(context, chartConfig); // create and display the chart
}

// Formats the weekdays (x axis) of the weather chart
function formatChartWeekdays(){
    const week = [];
    const DAYS_IN_WEEK = 7;
    const currentDate = new Date(); 
    const monthNumToDays = new Map([ [0, 31], [1, 28], [2, 31], [3, 30], [4, 31], [5, 30], [6, 31], [7, 31], [8, 31], [9, 31], [10, 30], [11, 31] ]); // 0=jan, 1=feb, ...
    for (let i = 0; i < DAYS_IN_WEEK; i++){
        let date = currentDate.getDate() + i;
        const numDaysInCurrentMonth = monthNumToDays.get(currentDate.getMonth());
        if (date > numDaysInCurrentMonth){
            const newMonth = currentDate.getMonth() + 1;
            currentDate.setMonth(newMonth);
            date = Math.abs(date - numDaysInCurrentMonth);
        }
        const monthFormatted = new Intl.DateTimeFormat("en-us", {month: "long"}).format(currentDate);
        week.push(monthFormatted + " " + date);
    }
    return week;
}

export default makeWeatherChart;