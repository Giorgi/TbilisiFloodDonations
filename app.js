var app = {
    chart: null,

    initialize: function () {
        if (app.chart === null) {
            app.chart = $('#container');
        }

        app.chart.text('Loading...');
    },

    loadData: function (callback) {
        $.getJSON('data.json', callback);
    },

    render: function () {
        app.loadData(function (response) {
            app.chart.highcharts({
                tooltip: {
                    useHTML: true,
                    formatter: function () {
                        var result = '<b style="font-size:16px"><a target="_blank" href="' + this.point.info.url + '">' + this.point.name + '</a>' + ' - ' + this.point.value + ' 000 ლარი</b>';
                        result += '<br/>';
                        result += '<br/>';
                        result += '<img src="' + this.point.info.logo + '"></img>';
                        return result;
                    }
                },
                series: [{
                    type: 'treemap',
                    alternateStartingDirection: true,
                    layoutAlgorithm: 'squarified',
                    levels: [{
                        level: 1,
                        dataLabels: {
                            style: {
                                fontSize: '16px'
                            }
                        }
                    }],
                    data: response.data
                }],
                title: {
                    text: ''
                }, credits: {
                    enabled: false
                }
            });
        });
    }
};

$(function () {
    if (window.location.host == 'giorgi.github.io') {
        window.location = "http://tbilisiflood.info/";
        return;
    }

    app.initialize();
    app.render();
});
