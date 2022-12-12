var app = {
    chart: null,

    initialize: function () {
        if (app.chart === null) {
            app.chart = $('#container');
        }

        app.chart.text('Loading...');
    },

    loadData: function (callback) {
        $.ajax({
            dataType: "json",
            url: 'https://sheets.googleapis.com/v4/spreadsheets/15j7-zEXr6JTtR5m5p44gstSjHNzijm9uFBO8Naj4KgI/values/Sheet1?key=AIzaSyCL-ELa1-5cbJpcgRcTLvgZpEUNxF0DBqo',
            data: {},
            success: callback,
            timeout: 3000
        }).fail(function (xhr, textStatus, errorThrown) {
            if (xhr.state() === 'rejected') {
                $.getJSON('http://cors.io/?u=https://sheets.googleapis.com/v4/spreadsheets/15j7-zEXr6JTtR5m5p44gstSjHNzijm9uFBO8Naj4KgI/values/Sheet1?key=AIzaSyCL-ELa1-5cbJpcgRcTLvgZpEUNxF0DBqo', callback);
            }
        });
    },
    formatNumber: function (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    render: function () {
        app.loadData(function (response) {

            var data = jQuery.map(response.values.slice(1), function ([name, amount, color, url, logo]) {
                var result = {
                    name: name,
                    value: parseInt(amount),
                    color: color,
                    info: {
                        url: url,
                        logo: logo
                    }
                };

                result.dataLabels = { style: { fontSize: result.value >= 1000 ? '36px' : result.value > 200 ? '32px' : result.value > 20 ? '16px' : '8px' } };

                return result;
            });

            var total = 0;
            for (var i = 0, n = data.length; i < n; i++) {
                total += data[i].value;
            }

            app.chart.highcharts({
                tooltip: {
                    useHTML: true,
                    formatter: function () {
                        var result = '<b style="font-size:16px"><a target="_blank" href="' + this.point.info.url + '">' + this.point.name + '</a>' + ' - '
                                        + app.formatNumber(this.point.value * 1000) + ' ლარი</b>';
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
                    data: data
                }],
                title: {
                    text: 'სულ: ' + app.formatNumber(total * 1000) + ' <img src="lari.png"></img>',
                    useHTML: true,
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
