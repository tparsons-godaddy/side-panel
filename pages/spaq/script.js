  document.getElementById('dataForm').addEventListener('submit', async (e) => {
    let spaqValues = 0;
    
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
        console.log('First call', result)
      })
      
      .catch((error) => console.error(error));


      const spaqData = spaqValues.day.buckets.map(poll => poll['poll_id.keyword'].buckets[0].metric_value.value)
      
      const addVals = (vals) => {
        let sum = 0;
    
        for(let i = 0; i < vals.length; i++) {
            sum += vals[i]
        }
        return sum
      }

      const total = addVals(spaqData)
      const weekAverage =  total * 100 / 8 // spaq uses 8 days

        
      console.log('HERE WE GO ', weekAverage)
  }});
