fetch('/penpals')
  .then(res => handleCSV(res, "German Penpals"))
fetch('/25students')
  .then(res => handleCSV(res, "8th Graders"))
fetch('/26students')
  .then(res => handleCSV(res, "7th Graders"))
  
async function handleCSV(res, canvas_id){
  const text = await res.text()
  const raw = csvToArray(text)
  const parsed = raw.map(row => {
    for(k in row){
      if(row[k]) row[k] = row[k].split('^')
      else delete row[k]
    }
    return row;
  })
  
  var data = {}
  parsed.map(row => {
    for(k in row){
      const v = row[k]
      var _data = data[k] || {}
      for(_v of v){
        if(!_data[_v]) _data[_v] = 1
        else _data[_v] += 1
      }
      data[k] = _data
    }
  })
  
  for(k in data){
    var v = data[k]
    const div = document.createElement('div')
    const canvas = document.createElement('canvas')
    canvas.id = `${canvas_id} - ${k}`
    canvas.height = "300"
    canvas.width = "500"
    div.append(canvas)
    const button = document.createElement('button')
    button.innerHTML = "Save Above Chart"
    button.onclick = (e) => {
      var link = document.getElementById('link');
      link.setAttribute('download', `${canvas_id}-${k}.png`);
      link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
      link.click();
    }
    div.append(button)
    document.body.append(div)
    var colorsArr = Object.values(v).map(v => getRandomColor())
    var chart = new Chart(canvas.id, {
      type: "bar",
      data: {
        labels: Object.keys(v),
        datasets: [{
          label: k,
          data: Object.values(v).sort((a, b) => b>a),
          backgroundColor: colorsArr
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: canvas_id,
          }
        }
      }
    })
  }
}
  
function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}