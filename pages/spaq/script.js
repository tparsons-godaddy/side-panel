


  const submitButton = document.getElementById('submit');

  // Helper functions
    const useState = (defaultValue) => {
      let value = defaultValue;

      function getValue() {
        return value;
      }

      function setValue(newValue) {
        return value = newValue
      }
      return [getValue, setValue];
    }

    // Constants
    const DAY_COUNT = 25;
    const WEEK_COUNT = 8;

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showingTable, setShowingTable] = useState(false);


    /// API call to get SPAQ values
    async function getSpaqValues(e) {
      e.preventDefault();
      setIsLoading(true);

      document.getElementById('submit')
      setIsLoaded(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        redirect: "follow"
      };

      try {
        const response = await fetch("http://localhost:9099/get-spaq", requestOptions);
        const result = await response.json();
        console.log('Fetched data:', result); 
        return result;
      } catch (error) {
        console.error('Fetch error:', error);
        return null;
      } finally {
        setIsLoading(false);
        submitButton.textContent = 'Clear Table';
        submitButton.setAttribute('id', 'submit-loaded');
      }
    }


    async function buildTable(spaqValues, e) {
      if (!spaqValues) {
        return;
      }

      const [ 
        difyHeaderDayValues, difyHeaderWeekValues,
        difyRequestDayValues, difyRequestWeekValues,
        difySharedDayValues, difySharedWeekValues,
        marketingHubDayValues, marketingHubWeekValues
      ] = spaqValues;


      const extractData = (data, timeFrame, bucket = 0) => {
        const key = timeFrame === 'day' ? 'day' : 'hour';
        return data[key].buckets.map(poll => poll['poll_id.keyword'].buckets[bucket].metric_value.value);
      };
      
      const difyHeaderDayData = extractData(difyHeaderDayValues, 'hour');
      const difyHeaderWeekData = extractData(difyHeaderWeekValues, 'day');
      
      const difyRequestDayData = extractData(difyRequestDayValues, 'hour');
      const difyRequestWeekData = extractData(difyRequestWeekValues, 'day');
      
      const difySharedDayData = extractData(difySharedDayValues, 'hour');
      const difySharedWeekData = extractData(difySharedWeekValues, 'day');
      
      const marketingHubDayData = extractData(marketingHubDayValues, 'hour', 2);
      const marketingHubWeekData = extractData(marketingHubWeekValues, 'day', 2);
      
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
        const formattedAverage = average.toFixed(3);
        console.log(`${label} Average: ${formattedAverage}`);
        return formattedAverage;
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

    // Marketing Hub 
    const marketingHubDayAverage = extractAndLogData(marketingHubDayData, 'Marketing Hub Day', DAY_COUNT);
    const marketingHubWeekAverage = extractAndLogData(marketingHubWeekData, 'Marketing Hub Week', WEEK_COUNT);
    
    const repos = [
      {
        'Dify Header': {
        'Day': difyHeaderDayAverage,
        'Week': difyHeaderWeekAverage
        }
      },
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
      },
      {
        'Marketing Hub': {
          'Day': marketingHubDayAverage,
          'Week': marketingHubWeekAverage
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
    headerCell2.textContent = '24hr / 1wk Average';
    headerRow.appendChild(headerCell2);

    table.appendChild(headerRow);

    const textContentColor = (average) => {
      const numAverage = parseFloat(average);

      if (numAverage >= 99.99) {
        return '#00a646';
    } else if (numAverage >= 89.9) {
        return '#f0b32f';
    } else {
        return '#e51a19';
    }
    }

    // Populate the table with repos data
    repos.forEach(repo => {
        const row = document.createElement('tr');
        
        const repoName = Object.keys(repo)[0]; 
        const averages = repo[repoName]; 

        const cell1 = document.createElement('td');
        cell1.textContent = repoName;
        row.appendChild(cell1);

        const cell2 = document.createElement('td');

        const daySpan = document.createElement('span');
        daySpan.textContent = averages.Day;
        daySpan.style.color = textContentColor(averages.Day);

        const weekSpan = document.createElement('span');
        weekSpan.textContent = averages.Week;
        weekSpan.style.color = textContentColor(averages.Week);

        const separatorText = document.createTextNode(' / ');
        
        cell2.appendChild(daySpan);
        cell2.appendChild(separatorText);
        cell2.appendChild(weekSpan);

        row.appendChild(cell2);
        table.appendChild(row);
    });

    setShowingTable(true);
    document.getElementById('spaq-details').appendChild(table);

    const submitLoaded = document.getElementById('submit-loaded');
    submitLoaded.addEventListener('click', () => {
        table.remove();
        setShowingTable(false);
        setIsLoaded(false);
        setIsLoading(false);
        setShowingTable(false);
        submitButton.textContent = 'Get SPAQ Details';
        submitButton.setAttribute('id', 'submit');
    });
    };

    submitButton. addEventListener('click', async (e) => {
      if(submitButton.textContent === 'Get SPAQ Details') {
        submitButton.textContent = 'Loading...';
        const data = await getSpaqValues(e);
        buildTable(data, e);
        submitButton.textContent = 'Clear Table';
      } else {
        // Clear the table
        tableBody.innerHTML = ''; // Clear existing rows
        toggleButton.textContent = 'Load Table'; // Reset button text
    }
    });

    // MAIN CALL TO LOAD TABLE
    document.getElementById('dataForm').addEventListener('submit', async (e) => {
      await buildTable(e);
    });
