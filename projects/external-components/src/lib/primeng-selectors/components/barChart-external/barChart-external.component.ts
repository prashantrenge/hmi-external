import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-bar-chart',
  template: `
    <div class="chart-container">
      <h2>Increase in Temperature in India (Last 10 Years)</h2>
      <canvas id="temperatureChart"></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      max-width: 600px;
      margin: auto;
      text-align: center;
    }
    canvas {
      background-color: #f4f4f4;
      border: 1px solid #ccc;
    }
  `]
})
export class BarChartComponent extends CommonExternalComponent {
  private temperatureData = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34]; // Sample data for 10 years
  private labels = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = (document.getElementById('temperatureChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Temperature (°C)',
            data: this.temperatureData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            }
          }
        }
      });
    }
  }
}