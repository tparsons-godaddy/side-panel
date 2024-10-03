  document.getElementById('dataForm').addEventListener('submit', async (e) => {
    let spaqValues = 0;
    const DAY_COUNT = 25;
    const WEEK_COUNT = 8;
    
    await getToken();
    
    async function getToken() {
      e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      redirect: "follow"
    };

    await fetch("http://localhost:9099/get-spaq", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        spaqValues = result;
      })
      .catch((error) => console.error(error));

      const [ 
        difyHeaderDayValues, difyHeaderWeekValues,
        difyRequestDayValues, difyRequestWeekValues,
        difySharedDayValues, difySharedWeekValues ] = spaqValues;

      const extractData = (data, timeFrame) => {
        const key = timeFrame === 'day' ? 'day' : 'hour';
        return data[key].buckets.map(poll => poll['poll_id.keyword'].buckets[0].metric_value.value);
      };
      
      const difyHeaderDayData = extractData(difyHeaderDayValues, 'hour');
      const difyHeaderWeekData = extractData(difyHeaderWeekValues, 'day');
      
      const difyRequestDayData = extractData(difyRequestDayValues, 'hour');
      const difyRequestWeekData = extractData(difyRequestWeekValues, 'day');
      
      const difySharedDayData = extractData(difySharedDayValues, 'hour');
      const difySharedWeekData = extractData(difySharedWeekValues, 'day');
      

      const sumOfValues = (vals) => {
        let sum = 0;
    
        for(let i = 0; i < vals.length; i++) {
            sum += vals[i]
        }
        return sum
      }

    const extractAndLogData = (data, label, count) => {
      const total = sumOfValues(data);
      const average = (total * 100) / count;
      console.log(`${label} Average: ${average}`);
      return average;
    }
  
    // Dify Header
    const difyHeaderDayAverage = extractAndLogData(difyHeaderDayData, 'Dify Header Day', DAY_COUNT);
    const difyHeaderWeekAverage  = extractAndLogData(difyHeaderWeekData, 'Dify Header Week', WEEK_COUNT);

    // Dify Request
    const difyRequestDayAverage = extractAndLogData(difyRequestDayData, 'Dify Request Day', DAY_COUNT);
    const difyRequestWeekAverage = extractAndLogData(difyRequestWeekData, 'Dify Request Week', WEEK_COUNT);

    //Dify Shared
    const difySharedDayAverage  = extractAndLogData(difySharedDayData, 'Dify Shared Day', DAY_COUNT);
    const difySharedWeekAverage  = extractAndLogData(difySharedWeekData, 'Dify Shared Week', WEEK_COUNT);

    const spaqAverages = [difyHeaderDayAverage, difyHeaderWeekAverage, difyRequestDayAverage, difyRequestWeekAverage, difySharedDayAverage, difySharedWeekAverage];
    console.log('XXX ', spaqAverages);
    const spaqRepos = ['Dify Header', 'Dify Request', 'Dify Shared'];
    
    const repos = [
      {'Dify Header': {
        'Day': difyHeaderDayAverage,
        'Week': difyHeaderWeekAverage
      }},
      {
        'Dify Request': {
          'Day': difyRequestDayAverage,
          'Week': difyRequestWeekAverage
        },
      },
      {
        'Dify Shared': {
          'Day': difySharedDayAverage,
          'Week': difySharedWeekAverage
        }
      }
    ]

    // Create table
    const table = document.createElement('table');
    table.style.border = '1px solid gray';

    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = 'lightgray';

    const headerCell1 = document.createElement('th');
    headerCell1.textContent = 'Repository Name';
    headerRow.appendChild(headerCell1);

    const headerCell2 = document.createElement('th');
    headerCell2.textContent = 'Day Average';
    headerRow.appendChild(headerCell2);

    const headerCell3 = document.createElement('th');
    headerCell3.textContent = 'Week Average';
    headerRow.appendChild(headerCell3);

    table.appendChild(headerRow);

    // Populate the table with repos data
    repos.forEach(repo => {
        const row = document.createElement('tr');
        
        const repoName = Object.keys(repo)[0]; // Get the repository name
        const averages = repo[repoName]; // Get the averages object

        const cell1 = document.createElement('td');
        cell1.textContent = repoName;
        row.appendChild(cell1);

        const cell2 = document.createElement('td');
        cell2.textContent = averages.Day; // Day average
        row.appendChild(cell2);

        const cell3 = document.createElement('td');
        cell3.textContent = averages.Week; // Week average
        row.appendChild(cell3);

        table.appendChild(row);
    });

    document.getElementById('spaq-details').appendChild(table);

    // const table = document.createElement('table');
    // const tableBody = document.createElement('tbody');

    // for(let i = 0; i < spaqAverages.length / 2; i++) {
    //   const row = document.createElement('tr');

    //   for(let j = 0; j <= spaqRepos; j++) {
    //     const cell = document.createElement('td');
    //     const cellText = document.createTextNode(``)
    //   }
    // }

  }});
