;(function () {
  'use strict' // class를 만들때는 굳이 use strict가 필요 없다. 

  const get = (e) => document.querySelector(e);

  class Chart {
    constructor(parent = 'body', data = {}, { width, height, radius, colors }) {
      this.parent = get(parent);
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');
      this.legends = document.createElement('div');
      this.legends.classList.add('legends');
      this.parent.appendChild(this.canvas);
      this.parent.appendChild(this.legends);
      this.label = '';
      this.total = 0;
      this.datas = Object.entries(data);  // Object.entries 는 객체가 가지고 있는 모든 프로퍼티를 키와 벨류 쌍으로 배열 형태로 반환.
      this.radius = radius;
      this.colors = colors;
    }

    getTotal = () => {
      for (const [data, value] of this.datas) {
        this.total += value;
      };
    };

    drawLegends = () => {
      let index = 0;
      for (const [coin, value] of this.datas) {
        this.label += `<span style="background-color: ${this.colors[index]}"> 
        ${coin} </span>`
        index++
      }
      this.legends.innerHTML = this.label
    }

    drawCanvas = (centerX, centerY, radius, startAngle, endAngle, color) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = color;
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      this.ctx.closePath();
      this.ctx.fill();
    }

    drawChart = (donutChart, centerX, centerY, fontOption) => {   // 파이차트를 그림
      let initial = 0;
      let index = 0;
      let fontSize = fontOption.font.split('px')[0] || 14;

      for (const [data, value] of this.datas) {
        const angleValue = (value / this.total) * Math.PI * 2; // 해당 value가 전체 원에서 차지하는 부분. 
        this.drawCanvas(
          centerX,
          centerY,
          this.radius,
          initial,
          initial + angleValue,
          this.colors[index]
        )

        this.ctx.moveTo(centerX, centerY);

        const triangleCenterX = Math.cos(initial + angleValue / 2);   // 이부분 이해 안감 공부 필요. 
        const triangleCenterY = Math.sin(initial + angleValue / 2);
        const labelX = centerX - fontSize + ((2 * this.radius) / 3) * triangleCenterX; // 이부분 이해 안감 공부 필요. 
        const labelY = centerY + (this.radius / 2) * triangleCenterY;
        const text = Math.round((value / this.total) * 100) + '%';

        this.ctx.fillStyle = !!fontOption ? fontOption.color : 'black';
        this.ctx.font = !!fontOption ? fontOption.font : `${fontSize}px arial`
        this.ctx.fillText(text, labelX, labelY);

        initial += angleValue;
        index++;
      };

      if (donutChart) {  // 도넛 차트를 그림, 기존의 파이차트의 가운데 하얀색 원을 추가해서 도넛처럼 보이게 하는것.
        this.drawCanvas(
          centerX,
          centerY,
          this.radius / 4,  // 파이차트보다 사이즈가 작아야 한다. 
          0,  
          Math.PI * 2,  // 그냥 흰색 원을 그림
          'white'
        )
      }
    }

  }

  const data = {
    GALA: 30,
    BTC: 20,
    ETH: 25,
    XRP: 18,
  }

  const option = {
    radius: 150,
    width: 700,
    height: 500,
    colors: ['#c15454', '#6fd971', '#687bd2', '#b971e0'],
  }

  const labelOpion = {
    color: '#fff',
    font: "20px  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
  }

  const chart = new Chart('.canvas', data, option);
  const { width, height, radius} = option;
  chart.getTotal();
  chart.drawLegends();
  chart.drawChart(false, width / 2 - 10 - radius, height / 2, labelOpion);
  chart.drawChart(true, width / 2 + 20 + radius, height / 2, labelOpion);
  
})()
