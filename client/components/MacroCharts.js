import React from "react";
import { Scatter } from 'react-chartjs-2';

export const ChartCard = (props) => {
  
  const chart_group = props.chart_group;  
  
  const formatter = (number, format) => {
    if (format === "currency") { return(
      new Intl.NumberFormat("en-US", { 
        style: "currency", 
        currency: "USD", 
        maximumFractionDigits: 0 
        }).format(number)
    )};
    if (format === "decimal-whole") { return(
      new Intl.NumberFormat("en-US", { 
        style: "decimal", 
        currency: "USD", 
        maximumFractionDigits: 0 
        }).format(number)
    )};
    if (format === "decimal-one") { return(
      new Intl.NumberFormat("en-US", { 
        style: "decimal", 
        currency: "USD", 
        maximumFractionDigits: 1 
        }).format(number)
    )};
    if (format === "percent") { 
      return(
      new Intl.NumberFormat("en-US", { 
        style: "percent", 
        currency: "USD", 
        maximumFractionDigits: 1 
        }).format(number/100)
    )};
    }
    
  const legend = {
    display: (chart_group.datasets.length > 1) ? true : false,
    position: 'bottom',
    align: 'start',
    labels: {boxWidth: 10}
  };
  
  const options = () => {
    return (
      {
        responsive: true,
        maintainAspectRatio: false,
        title: { display: false},
        scales: { 
          yAxes: [ { 
            display: true,
            ticks: {
              suggestedMin: chart_group.min*0.75,
              callback: function (value, index, values) {return(formatter(value,chart_group.format))},
              autoSkip: true,
              autoSkipPadding: 30
            }
          }],
          xAxes: [{
            type: 'time',
            gridLines: {display:false},
            time: {
              units: 'year',
              displayFormats: {year: 'YYYY'},
              tooltipFormat: 'YYYY MMM'
            }
          }],
        }, 
        elements: {point: {radius:0.5} }
      }
    )
  }
  
  return(   
    <div className="chartCard">
      <div className="chartTitle">
        {chart_group.datasets.map( (series_dataset) => {
          const lastDataPoint = series_dataset.data.length-1;
          return (
            <div key={series_dataset.label}>
              <p>{series_dataset.label}: {formatter(series_dataset.data[lastDataPoint].y,chart_group.format)}</p>
            </div>
          )
        })}
        <p></p>
      </div>
      <div className="chart">
        <Scatter data={ chart_group } legend={ legend } options={ options(props.min) } />
      </div>
    </div>
  )
}