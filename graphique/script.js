document.addEventListener('DOMContentLoaded', function () {
  Promise.all([fetch('221410_A.json'), fetch('221410_B.json')])
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    })
    .then(function (data) {
      var dataA = data[0];
      var dataB = data[1];
      var similarData = getSimilarData(dataA, dataB);

      generateButtons(similarData, dataA, dataB, '#button-container1');
    })
    .catch(function (error) {
      console.error('Une erreur s\'est produite :', error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
  Promise.all([fetch('244138_A.json'), fetch('244138_B.json')])
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    })
    .then(function (data) {
      var dataA = data[0];
      var dataB = data[1];
      var similarData = getSimilarData(dataA, dataB);

      generateButtons(similarData, dataA, dataB, '#button-container2');
    })
    .catch(function (error) {
      console.error('Une erreur s\'est produite :', error);
    });
});

function getSimilarData(dataA, dataB) {
  var similarData = [];

  for (var i = 0; i < dataA.length; i++) {
    var redshiftA = dataA[i].Redshift;

    for (var j = 0; j < dataB.length; j++) {
      var redshiftB = dataB[j].Redshift;

      if (redshiftA === redshiftB) {
        similarData.push({
          Redshift: redshiftA,
          DataA: dataA[i],
          DataB: dataB[j]
        });
        break; // On arrête la recherche pour ce redshift
      }
    }
  }

  return similarData;
}

function generateButtons(similarData, dataA, dataB, contain) {
  var buttonContainer = document.querySelector(contain);

  for (var i = 0; i < similarData.length; i++) {
    var button = document.createElement('button');
    button.classList.add('button');
    button.textContent =  similarData[i].Redshift;
    button.dataset.index = i;
    button.dataA = dataA;
    button.dataB = dataB;
    button.addEventListener('click', handleButtonClick);
    buttonContainer.appendChild(button);
  }
}

function handleButtonClick(event) {
  var index = event.target.dataset.index;
  var similarData = getSimilarData(event.target.dataA, event.target.dataB);

  if (index >= 0 && index < similarData.length) {
    var selectedData = similarData[index];
    var tableContainer = document.querySelector('#table-container');
    tableContainer.innerHTML = '';
    generateTable(selectedData, tableContainer);
  }
}

function generateTable(selectedData, tableContainer) {
  var table = document.createElement('table');
  table.classList.add('comparison-table');

  var caption = document.createElement('caption');
  caption.textContent = 'Redshift: ' + selectedData.Redshift;
  table.appendChild(caption);

  var tableBody = document.createElement('tbody');


  var row = document.createElement('tr');

  var header = document.createElement('th');
  header.textContent = 'Propriètés';
  row.appendChild(header);
  var headerA = document.createElement('th');
  headerA.textContent = 'Data A';
  row.appendChild(headerA);
  var headerB = document.createElement('th');
  headerB.textContent = 'Data B';
  row.appendChild(headerB);
  var headerDiff = document.createElement('th');
  headerDiff.textContent = 'Différence (%)';
  row.appendChild(headerDiff);
  tableBody.appendChild(row);

  var dataA = selectedData.DataA;
  var dataB = selectedData.DataB;

  compareData(dataA, dataB, tableBody);

  table.appendChild(tableBody);
  tableContainer.appendChild(table);
}

function compareData(dataA, dataB, tableBody) {
  for (var prop in dataA) {
    let input = document.getElementById("seuil").value;

    var valueA = dataA[prop];
    var valueB = dataB[prop];

    var row = document.createElement('tr');

    var propCell = document.createElement('td');
    propCell.textContent = prop;
    row.appendChild(propCell);

    var valueACell = document.createElement('td');
    var valueBCell = document.createElement('td');
    var diffCell = document.createElement('td');

    if (valueA === null && valueB === null) {
      valueACell.textContent = 'null';
      valueBCell.textContent = 'null';
    } else if (valueA === null) {
      valueACell.textContent = 'null';
      valueBCell.textContent = JSON.stringify(valueB);
      valueBCell.classList.add('value-difference');
    } else if (valueB === null) {
      valueACell.textContent = JSON.stringify(valueA);
      valueBCell.textContent = 'null';
      valueACell.classList.add('value-difference');
    } else if (typeof valueA === 'object' && typeof valueB === 'object') {
      compareData(valueA, valueB, tableBody);
      continue;
    } else {
      valueACell.textContent = JSON.stringify(valueA);
      valueBCell.textContent = JSON.stringify(valueB);

      if (valueA !== valueB) {
        valueACell.classList.add('value-difference');
        valueBCell.classList.add('value-difference');
      }



      // Calcul de la différence relative
      var relativeDiff = ((valueA - valueB) / valueB) * 100;
      diffCell.textContent = relativeDiff.toFixed(2) + '%';

      var diffCellValue = parseFloat(diffCell.textContent); // Convertir en nombre
      var inputValue = parseFloat(input);

      if (!isNaN(diffCellValue) && diffCellValue > inputValue) {
        diffCell.classList.add('bleu');
        valueACell.classList.add('bleu');
        valueBCell.classList.add('bleu');
      }


      if (!isNaN(relativeDiff)) {
        if (relativeDiff > 0) {
          diffCell.classList.add('value-difference');
        }
      }
    }

    row.appendChild(valueACell);
    row.appendChild(valueBCell);
    row.appendChild(diffCell);

    tableBody.appendChild(row);
  }
}
