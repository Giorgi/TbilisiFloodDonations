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
            
            var total = 0;
            for(var i=0, n=response.data.length; i < n; i++) 
            { 
                total += response.data[i].value; 
            }

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
                    text: 'ჯამი: ' + (total*1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") +' ლარი',
                    floating: true,
                    align: 'left',
                    x: 100,
                    y: 30,
                    style: {
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }
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
