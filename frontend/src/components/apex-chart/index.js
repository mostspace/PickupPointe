import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ cost, income, xais }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 226,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xais,
      labels: {
        style: {
          colors: "rgba(24, 24, 26, 0.70)",
          fontSize: "10px",
          fontFamily: "Gilroy",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val,
        style: {
          colors: "rgba(24, 24, 26, 0.70)",
          fontFamily: "Gilroy",
          fontSize: "10px",
        },
      },
    },
    fill: {
      type: "solid",
      opacity: 1,
      colors: ["#F14445", "#3ACC48", "#9C27B0"],
    },
    tooltip: {
      y: {
        formatter: (val) => `$ ${val.toFixed(2)}`,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontFamily: "Gilroy, Arial",
      fontWeight: 500,
      labels: {
        colors: "rgba(24, 24, 26, 0.70)",
        useSeriesColors: false,
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6,
        fillColors: ["#F14445", "#3ACC48"],
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
  });

  useEffect(() => {
    setSeries([
      { name: "Cost", data: cost },
      { name: "Income", data: income },
    ]);
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: { ...prevOptions.xaxis, categories: xais },
    }));
  }, [cost, income, xais]);

  return (
    <div id="income-chart">
      <ReactApexChart options={options} series={series} type="bar" height={226} />
    </div>
  );
};

export default ApexChart;