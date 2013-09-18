var updateFreq = 60000; // get battery status every this value ms
var nbVal = 60; // max number of simultaneous saved values
var values = []; // saved values
var chart = new Object();


function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function getBatteryStatus() {
    values[values.length] = [(new Date()).getTime(), Math.round(navigator.battery.level * 100)];
    if (values.length > nbVal) {
        values.shift();
    }

    chart.series[0].setData(values, true);

    if (supports_html5_storage) {
        localStorage["chart"] = JSON.stringify(values);
    }
}

$(document).ready(function() {
    chartOptions = {
        chart: {
            renderTo: 'chart',
            type: 'area'
        },
        title: {
            text: 'Battery level'
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            labels: {
                formatter: function() {
                    return '';
                }
            },
        },
        yAxis: {
            title: {
                text: 'Percentage'
            },
            labels: {
                formatter: function() {
                    return this.value +'%';
                }
            },
            min: 0,
            max: 100
        },
        tooltip: {
            //pointFormat: '{point.y:,.0f}% at time {new Date(point.x)}'
            formatter: function() {
                return this.y + '% at ' + Highcharts.dateFormat('%e %b %H:%M', new Date(this.x));
            }
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'level',
            data: values,
        }]
    };

    if (supports_html5_storage()) {
        if (localStorage["chart"]) {
            values = JSON.parse(localStorage["chart"]);
        }
    } else {
        console.log("There is no local storage in your browser. Cannot save the battery level graph");
    }

    chart = new Highcharts.Chart(chartOptions);
    setInterval(getBatteryStatus, updateFreq);
    getBatteryStatus();
});

$(function() {
	$("#get-battery").click(function() {
		$("#battery-pct").text(Math.round(navigator.battery.level * 100) + "%");
	});
});
