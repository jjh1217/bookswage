//날짜 type
const dateTypeMap = {
    '일간': 'daily',
    '주간': 'weekly',
    '월간': 'monthly',
    '연간': 'yearly'
};

//chart - 종류 지정
const chartMap = {};

//chart - date 설정
function randomData(length, min = 100, max = 4000, decimal = 0) {
    return Array.from({length}, () => parseFloat((Math.random() * (max - min) + min).toFixed(decimal)));
}

//x축 및 tooltip 날짜 값 설정
function generateChartData(type) {
    const chartToday = new Date();
    const labels = [];
    const tooltipDates = [];
    let prevYear = null;

    if (type === 'daily') {
        for (let i = 14; i >= 0; i--) {
            const d = new Date(chartToday);
            d.setDate(d.getDate() - i);
            const y = d.getFullYear();
            const m = d.getMonth() + 1;
            const day = d.getDate();
            const showYear = prevYear !== null && y !== prevYear;
            const label = showYear ? `${m}월 ${day}일\n${y}년` : `${m}월 ${day}일`;
            labels.push(label);
            tooltipDates.push(`${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
            prevYear = y;
        }
    } else if (type === 'weekly') {
        for (let i = 14; i >= 0; i--) {
            const d = new Date(chartToday);
            d.setDate(d.getDate() - (i * 7));
            const y = d.getFullYear();
            const m = d.getMonth() + 1;
            const firstDay = new Date(y, d.getMonth(), 1).getDay();
            const week = Math.ceil((d.getDate() + firstDay) / 7);
            const showYear = prevYear !== null && y !== prevYear;
            const label = showYear ? `${m}월 ${week}주\n${y}년` : `${m}월 ${week}주`;
            labels.push(label);
            tooltipDates.push(`${y}-${String(m).padStart(2, '0')}-${week}주`);
            prevYear = y;
        }
    } else if (type === 'monthly') {
        for (let i = 14; i >= 0; i--) {
            const d = new Date(chartToday.getFullYear(), chartToday.getMonth() - i, 1);
            const y = d.getFullYear();
            const m = d.getMonth() + 1;
            const showYear = prevYear !== null && y !== prevYear;
            const label = showYear ? `${m}월\n${y}년` : `${m}월`;
            labels.push(label);
            tooltipDates.push(`${y}-${String(m).padStart(2, '0')}`);
            prevYear = y;
        }
    } else if (type === 'yearly') {
        for (let i = 4; i >= 0; i--) {
            const y = chartToday.getFullYear() - i;
            labels.push(`${y}년`);
            tooltipDates.push(`${y}`);
        }
    }
    return {labels, tooltipDates};
}

//tooltip - 위치 조정
Chart.Tooltip.positioners.offset = function(elements) {
    if (!elements.length) return false;
    const el = elements[0];
    const tooltipWidth = this.chart.tooltip.width || 120;
    const isRightEdge = el.element.x + tooltipWidth + 20 > this.chart.width;
    return {
        x: isRightEdge ? el.element.x - tooltipWidth + 2 : el.element.x + 20,
        y: el.element.y - 10
    };
};

//chart - line 생성
function createLineChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);

    //chart - line datasets 공통값
    datasets = datasets.map(ds => {
        const mapped = {
            backgroundColor: 'transparent',
            fill: false,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: ds.borderColor,
            pointHitRadius: 8,
            clip: false,
            ...ds
        };
        if (ds.gradient) {
            const ctx = canvas.getContext('2d');
            const ctxHeight = canvas.parentElement.offsetHeight || 300;
            const gradient = ctx.createLinearGradient(0, 0, 0, ctxHeight);
            ds.gradient.forEach(({stop, color}) => gradient.addColorStop(stop, color));
            mapped.backgroundColor = gradient;
            delete mapped.gradient;
        }
        return mapped;
    });

    //chart - line 설정
    const lineInstance = new Chart(canvas, {
        type: 'line',
        data: {labels, datasets},
        options: {
            responsive: true,
            plugins: {
                legend: {display: false},
                tooltip: { //tooltip 커스텀
                    displayColors: false,
                    position: 'offset',
                    padding: {top: 12, bottom: 8, left: 12, right: 12},
                    borderWidth: 1,
                    titleColor: '#999',
                    bodyColor: '#414141',
                    titleFont: {family: 'Pretendard', size: 13, weight: '400', lineHeight: '0.8'},
                    bodyFont: {family: 'Pretendard', size: 14, weight: '600', lineHeight: '1.2'},
                    backgroundColor: '#FFF',
                    caretSize: 0,
                    cornerRadius: 12,
                    xAlign: 'left',
                    yAlign: 'top',
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            return options.tooltipDates?.[index] ?? tooltipItems[0].label;
                        },
                        label: function(tooltipItem) {
                            return tooltipItem.dataset.label + ' ' + tooltipItem.formattedValue;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: options.yMin ?? 0, //y축 최소값
                    max: options.yMax ?? 4000, //y축 최대값
                    beginAtZero: true,
                    ticks: {
                        stepSize: options.yStep ?? 500, //y축 눈금 간격
                        padding: 20, //y축 눈금 여백
                        color: '#999',
                        font: {family: 'Pretendard', size: 14, weight: '400'},
                        callback: options.hideZero ? function(value) {return value === 0 ? '' : value;} : undefined //y축 0 숨김 여부
                    },
                    border: {display: false}
                },
                x: {
                    offset: true,
                    ticks: {
                        padding: 20,
                        color: '#999',
                        font: {family: 'Pretendard', size: 14, weight: '400', lineHeight: 1.5},
                        callback: function(value, index) {
                            const label = this.getLabelForValue(index);
                            return label.split('\n');
                        }
                    },
                    border: {display: false},
                    grid: {drawTicks: false, drawOnChartArea: false, drawBorder: false}
                }
            }
        },
        plugins: [{
            beforeTooltipDraw(chart, args) {
                const tooltip = args.tooltip;
                if (!tooltip?.dataPoints?.length) return;
                tooltip.width = Math.max(tooltip.width, 120);
                tooltip.options.borderColor = chart.data.datasets[tooltip.dataPoints[0].datasetIndex]?.borderColor;
            }
        }]
    });

    //legend - 생성
    createLegend(canvasId, datasets);

    return lineInstance;
}

//chart - donut 생성
function createDonutChart(canvasId, data, datasets) {
    const donutInstance = new Chart(document.getElementById(canvasId), {
        type: 'doughnut',
        data: {
            datasets: [{
                data,
                backgroundColor: datasets.map(ds => ds.backgroundColor),
                borderWidth: 3,
                borderRadius: 4,
                borderColor: '#FFF',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '78%',
            layout: {padding: 4},
            plugins: {
                legend: {display: false},
                tooltip: {enabled: false}
            },
            hover: {mode: null}
        },
        plugins: [{
            id: 'partialBorder',
            afterDatasetDraw(chart) {
                const { ctx } = chart;
                const meta = chart.getDatasetMeta(0);
                meta.data.forEach((el, i) => {
                    const {x, y, startAngle, endAngle, outerRadius} = el;
                    const offset = 0.04;
                    const adjStart = startAngle + offset;
                    const adjEnd = endAngle - offset;
                    if (adjEnd <= adjStart) return;
                    ctx.save();
                    ctx.strokeStyle = datasets[i].borderColor;
                    ctx.lineWidth = 5;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.arc(x, y, outerRadius, adjStart, adjEnd);
                    ctx.stroke();
                    ctx.restore();
                });
            }
        }]
    });

    //legend - 생성
    createLegend(canvasId, datasets, data);

    return donutInstance;
}

//legend 함수 - chart_legend 여부에 따라 legend 생성
function createLegend(canvasId, datasets, data = null) {
    const $legendEl = $('#' + canvasId).closest('.chart_box').find('.chart_legend');
    if ($legendEl.length === 0) return;
    const total = data ? data.reduce((sum, v) => sum + v, 0) : 0;
    $legendEl.empty();
    datasets.forEach((ds, i) => {
        const valueHtml = data ? `<strong style="color:${ds.borderColor}">${data[i]} (${Math.round(data[i] / total * 100)}%)</strong>` : '';
        $legendEl.append(`
            <p class="item">
                <span>
                    <i style="background:${ds.borderColor}"></i>
                    ${ds.label}
                </span>
                ${valueHtml}
            </p>
        `);
    });
}

//chart - 날짜 type 변경 및 line chart 재생성
$(document).on('change', '.chk_tab input[type="radio"]', function() {
    const {labels, tooltipDates} = generateChartData(dateTypeMap[$(this).closest('.item').find('span').text()]);
    const canvasId = $(this).closest('.chk_tab').data('chart');
    const $loadingBox = $('#' + canvasId).closest('.loading_inBox');
    const chartType = chartMap[canvasId];
    if (!chartType) return;
    loadingShow($loadingBox);
    setTimeout(function() {
        chartType.data.labels = canvasId === 'chart_dwm' ? labels.slice(0, 10) : labels;
        chartType.data.datasets.forEach(ds => {
            const len = canvasId === 'chart_dwm' ? 10 : labels.length;
            ds.data = randomData(len, ds._min, ds._max, ds._decimal ?? 0);
        });
        chartType.options.plugins.tooltip.callbacks.title = t => tooltipDates[t[0].dataIndex];
        chartType.update();
        loadingHide($loadingBox);
    }, 1500);
});