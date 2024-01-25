$(document).ready(function () {
  let PageTitles = [
    "Entire Organization",
    "Entire Organization > Sales",
    "Entire Organization > Marketing",
    "Entire Organization > Customer Service",
  ];

  let i = 0;
  Object.keys(allCsvData).forEach((key) => {
    let folder = allCsvData[key];
    let folderArray = [];
    for (const key in folder) {
      if (folder.hasOwnProperty(key)) {
        let subfolder = folder[key];
        folderArray.push(subfolder);
      }
    }
    createDashboard(folderArray, i);
    i++;
  });

  function generateTable(departments, counter) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "table-section";
    sectionDiv.style.marginBottom = "20px";

    const table = document.createElement("table");
    table.id = "department-data_" + counter;
    table.className = "styled-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    thead.appendChild(headerRow);

    const headers = Object.keys(departments[0]);

    headers.forEach((headerText) => {
      const header = document.createElement("th");
      header.textContent = headerText;
      headerRow.appendChild(header);
    });

    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    departments.forEach((dept) => {
      const row = document.createElement("tr");

      headers.forEach((hearder) => {
        const nameCell = document.createElement("td");
        nameCell.textContent = dept[hearder];
        row.appendChild(nameCell);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    sectionDiv.appendChild(table);
    return sectionDiv;
  }

  function createChartsContainer(tenureData, turnoverData, counter) {
    const chartsContainer = document.createElement("div");
    chartsContainer.className = "charts-container";

    const turnoverChartDiv = document.createElement("div");
    turnoverChartDiv.className = "chart";
    const turnoverChartCanvas = document.createElement("canvas");
    turnoverChartCanvas.id = "turnoverChart_" + counter;
    turnoverChartDiv.appendChild(turnoverChartCanvas);
    chartsContainer.appendChild(turnoverChartDiv);

    const tenureChartDiv = document.createElement("div");
    tenureChartDiv.className = "chart";
    const tenureChartCanvas = document.createElement("canvas");
    tenureChartCanvas.id = "tenureChart_" + counter;
    tenureChartDiv.appendChild(tenureChartCanvas);
    chartsContainer.appendChild(tenureChartDiv);

    document.body.appendChild(chartsContainer);

    generateTurnoverChart(turnoverData, "turnoverChart_" + counter);
    generateTenureChart(tenureData, "tenureChart_" + counter);

    return chartsContainer;
  }

  function generateTurnoverChart(chartData, chartId) {
    const ctx = document.getElementById(chartId).getContext("2d");
    let transformedData = transformTurnoverData(chartData);
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: transformedData.labels,
        datasets: transformedData.datasets,
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "quarter",
              displayFormats: {
                quarter: "yyyy-q",
              },
            },
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Turnover Rate",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  function generateTenureChart(chartData, chartId) {
    const tenureCtx = document.getElementById(chartId).getContext("2d");
    let transformedData = transformTenureData(chartData);
    const tenureChart = new Chart(tenureCtx, {
      type: "bar",
      data: transformedData,
      options: {
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Median Tenure (Years)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  function transformTurnoverData(sampleData) {
    const datasetsMap = {};

    sampleData.forEach((item) => {
      if (!datasetsMap[item.y]) {
        datasetsMap[item.y] = {
          label: item.y,
          data: [],
          fill: false,
          borderColor: getRandomColor(),
        };
      }
      datasetsMap[item.y].data.push({ x: item.x, y: parseFloat(item.series) });
    });

    for (const dataset in datasetsMap) {
      datasetsMap[dataset].data.sort((a, b) => new Date(a.x) - new Date(b.x));
    }

    return {
      labels: sampleData.map((item) => item.x).sort(),
      datasets: Object.values(datasetsMap),
    };
  }

  function transformTenureData(sampleData) {
    const companyData = sampleData
      .filter((item) => item.series === "Company")
      .map((item) => ({ y: item.y, x: parseFloat(item.x) }));
    const competitorData = sampleData
      .filter((item) => item.series === "Competitor")
      .map((item) => ({ y: item.y, x: parseFloat(item.x) }));

    const labels = companyData.map((data) => data.y);

    return {
      labels: labels,
      datasets: [
        {
          label: "Company",
          data: companyData.map((data) => data.x),
          backgroundColor: "blue",
        },
        {
          label: "Competitor",
          data: competitorData.map((data) => data.x),
          backgroundColor: "orange",
        },
      ],
    };
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function createDashboard(data, counter) {
    var dashboardDiv = $("#dashboard");
    addTitleToDashboard(PageTitles[counter]);
    dashboardDiv.append(generateTable(data[0], counter));
    dashboardDiv.append(generateTable(data[1], counter));
    dashboardDiv.append(createChartsContainer(data[2], data[3], counter));
  }

  function addTitleToDashboard(titleText) {
    var title = document.createElement("h2");
    title.textContent = titleText;
    title.className = "dashboard-title";

    var dashboardDiv = document.getElementById("dashboard");
    dashboardDiv.append(title);
  }
});
