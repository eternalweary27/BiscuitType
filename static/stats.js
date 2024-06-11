const scatter_plot_canvas = document.getElementById("scatter_plot");
const scatter_plot_context = scatter_plot_canvas.getContext("2d");

const bar_chart_canvas = document.getElementById("bar_chart");
const bar_chart_context = bar_chart_canvas.getContext("2d");

const language_filter = document.getElementById("language_filter");
const difficulty_filter = document.getElementById("difficulty_filter");
const graph_filter = document.getElementById("graph_filter");
const time_filter = document.getElementById("time_filter");
const moving_average_window_size = 3;
var scatter_plot;
var bar_chart;

function populateFromURL() {
    let url_params = new URLSearchParams(window.location.search);
    let url_language = url_params.get("language") ?? user_stats.default_language;
    let url_difficulty = url_params.get("difficulty") ?? user_stats.default_difficulty;
    let url_time = url_params.get("time") ?? "100";
    language_filter.value = url_language;
    difficulty_filter.value = url_difficulty;
    time_filter.value = url_time;
}

graph_filter.addEventListener("change", function(){
    drawScoresScatterPlot(graph_filter.value);
    drawScoresBarGraph(graph_filter.value);
});

function getMovingAverages(target_scores){
    let moving_averages = []
    for(let i = 0; i < target_scores.length - moving_average_window_size; i++){
        let window_data = target_scores.slice(i, i + moving_average_window_size);
        let window_data_sum = window_data.reduce((sum, point) => sum + point.y, 0);
        let window_data_avg = window_data_sum / moving_average_window_size;
        moving_averages.push({"x": i + Math.floor(moving_average_window_size / 2)+1, "y": window_data_avg});
    }
    return moving_averages;
}

function drawScoresScatterPlot(filter_value) {
    let chart_data = [];
    let target_scores;
    let background_colour;
    let point_border_colour;
    let border_colour;
    let moving_average_colour;
    let y_label;
    if(filter_value == "points"){
        target_scores = user_stats.all_points;
        background_colour = "rgba(255, 0, 0, 0.4)";
        border_colour = "rgba(255, 0, 0, 0)";
        moving_average_colour = "brown";
        y_label = "Points";

    }else{
        target_scores = user_stats.all_wpm;
        background_colour = "rgba(0, 0, 255, 0.4)";
        border_colour =  "rgba(0, 0, 255, 0)";
        moving_average_colour = "cyan";
        y_label = "WPM";
    }

    let x_value = 0;
    for (var score_value of target_scores) {
        chart_data.push({ "x": x_value + 1, "y": score_value });
        x_value += 1;
    }
    let moving_averages = getMovingAverages(chart_data);

    var scatter_data = {
        datasets: [{
            label: `${y_label} Over Time`,
            data: chart_data,
            backgroundColor: background_colour,
            pointBorderColour: point_border_colour,
            borderColor: border_colour,
            borderWidth: 0
        },{
            label: "Moving Average",
            data: moving_averages,
            backgroundColor: moving_average_colour,
            borderColor: moving_average_colour,
            borderWidth: 2,
            pointRadius: 0
        }]
    };

    var scatter_options = {
        scales: {
            x: {
                type: "linear",
                position: "bottom",
                ticks:{
                    display: false
                },
                title: {
                    display: true,
                    text: "Time",
                    font: {
                        size: 14,
                        family: "'Press Start 2P', sans-serif",
                        weight: "bold"
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: y_label,
                    font: {
                        size: 14,
                        family: "'Press Start 2P', sans-serif",
                        weight: "bold"
                    }
                },
                beginAtZero: true
            }
        }
    };

    if(scatter_plot){
        scatter_plot.destroy();
    }

    scatter_plot = new Chart(scatter_plot_context, {
        type: "line",
        data: scatter_data,
        options: scatter_options
    });
}

function drawScoresBarGraph(filter_value){
    
    let min;
    let max;
    let target_scores;
    let division_size;
    let background_colour;
    let border_colour;
    let title;
    if(filter_value == "points"){
        target_scores = user_stats.all_points;
        max = user_stats.highest_points;
        division_size = 100;
        background_colour = "rgba(255, 0, 0, 0.5)";
        border_colour = "brown";
        title = "Points Distribution";
    }else{
        target_scores = user_stats.all_wpm;
        max = user_stats.highest_wpm;
        division_size = 10;
        background_colour = "rgba(0,0,255,0.5)";
        border_colour = "cyan";
        title = "WPM Distribution";
    }
    min = target_scores.reduce((min, score) => score < min ? score : min, Number.POSITIVE_INFINITY);
    
    let labels = [];
    let chart_data = [];
    let division_start = Math.max(Math.floor(min / division_size)-2,0) * division_size;
    let division_end = division_start + division_size;
    while(division_end <= max+2*division_size){
        let label = `${division_start}-${division_end}`;
        let count = target_scores.filter(score => score >= division_start && score <= division_end).length;
        labels.push(label);
        chart_data.push(count);
        division_start = division_end+1;
        division_end = division_start+division_size;
    }
    if(target_scores.length > 0){
        labels.push(`${division_start}-${division_end}`);
        chart_data.push(0);
    }
    
    var bar_data = {
        labels: labels,
        datasets: [{
            label: title,
            data: chart_data,
            backgroundColor: background_colour, 
            borderColor: border_colour,
            borderWidth: 1
        }]
    };

    var bar_options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Frequency",
                    font: {
                        size: 14,
                        family: "'Press Start 2P', sans-serif",
                        weight: "bold"
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 14,
                        family: "'Press Start 2P', sans-serif",
                        weight: "bold"
                    }
                }
            }
        }
    };

    if(bar_chart){
        bar_chart.destroy();
    }

    bar_chart = new Chart(bar_chart_context, {
        type: "bar",
        data: bar_data,
        options: bar_options
    });
}

populateFromURL();
drawScoresScatterPlot("points");
drawScoresBarGraph("points");