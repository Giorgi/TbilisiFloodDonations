var app = {
    chart: null,
    initialize: function() {
        if (app.chart === null) {
            app.chart = $('#container');
        }
        app.chart.text('Loading...');
    },
    loadData: function(callback) {
        $.getJSON('data.json', callback);
    },
    styleFont: function() {
        $(window).change(function() {
            app.correctFontSize();
        });
    },
    correctFontSize: function() {
        correct();

        function correct() {
            var textTags = $('.highcharts-tracker g text');
            var squareTags = $('.highcharts-tracker rect');
            if (squareTags.length != textTags.length) return false;
            for (var current = 0; current < textTags.length; current++) {
                var tspanTags = textTags[current].getElementsByTagName(
                    'tspan');
                var squreWidth = squareTags[current].getAttribute(
                    "width")
                var maxWordLength = getMaxWordLength(tspanTags);
                var elementFontSize = parseInt(squreWidth / (
                    maxWordLength));
                textTags[current].style.fontSize = elementFontSize;
            }
        }

        function getMaxWordLength(tspanTags) {
            var maxLength = 0;
            for (var current = 0; current < tspanTags.length; current++) {
                var currentLength = tspanTags[current].innerHTML.length;
                if (currentLength > maxLength) maxLength =
                    currentLength;
                console.log(tspanTags[current].innerHTML);
            }
            return maxLength;
        }
    },
    render: function() {
        app.loadData(function(response) {
            app.chart.highcharts({
                tooltip: {
                    useHTML: true,
                    formatter: function() {
                        var result =
                            '<b style="font-size:16px"><a target="_blank" href="' +
                            this.point.info.url +
                            '">' + this.point.name +
                            '</a>' + ' - ' + this.point
                            .value +
                            ' 000 ლარი</b>';
                        result += '<br/>';
                        result += '<br/>';
                        result += '<img src="' +
                            this.point.info.logo +
                            '"></img>';
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
                },
                credits: {
                    enabled: false
                }
            });
        });
    }
}
$(function() {
    app.initialize();
    app.render();
    app.styleFont();
});
