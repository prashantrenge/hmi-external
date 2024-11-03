import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-bar-chart',
  template: `
    <div class="chart-container">
      <h2>Rise in Sea Water Temperature (Last 10 Years)</h2>
      <div class="bars">
        <div class="bar" *ngFor="let year of years" [style.height.%]="getBarHeight(year)">
          <span>{{ year.year }}: {{ year.temp }}°C</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 80%;
      margin: auto;
      text-align: center;
    }
    .bars {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 300px; /* Set a fixed height for the chart */
      margin-top: 20px;
      border-left: 2px solid #000; /* Optional: Add left border */
      border-bottom: 2px solid #000; /* Optional: Add bottom border */
    }
    .bar {
      width: 8%; /* Adjusted width for better spacing */
      background-color: #4CAF50;
      color: white;
      position: relative;
      transition: height 0.3s ease; /* Smooth transition for bar height */
    }
    .bar span {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 5px;
      font-size: 12px; /* Smaller font size for clarity */
    }
  `]
})
export class BarChartComponent extends CommonExternalComponent {
  years = [
    { year: 2013, temp: 14.5 },
    { year: 2014, temp: 14.7 },
    { year: 2015, temp: 14.9 },
    { year: 2016, temp: 15.1 },
    { year: 2017, temp: 15.3 },
    { year: 2018, temp: 15.5 },
    { year: 2019, temp: 15.7 },
    { year: 2020, temp: 15.9 },
    { year: 2021, temp: 16.1 },
    { year: 2022, temp: 16.3 }
  ];

  getBarHeight(year: { temp: number }): number {
    const minTemp = Math.min(...this.years.map(y => y.temp));
    const maxTemp = Math.max(...this.years.map(y => y.temp));
    return ((year.temp - minTemp) / (maxTemp - minTemp)) * 100;
  }
}