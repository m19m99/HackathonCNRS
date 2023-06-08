// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // ...
  // Le reste de la fonction number_format
  // ...
}
const earningsData = data[0].Redshift;

// Récupération des données JSON via une requête fetch
fetch('221410_A.json')
  .then(response => response.json())
  .then(data => {
    // Récupération des données nécessaires pour le graphique
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const earningsData = data.map(item => item.Redshift);
    console.log(earningsData);

    // Création du graphique avec les données récupérées
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Redshift",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: earningsData,
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          // ...
          // Les options pour les axes x et y
          // ...
        },
        legend: {
          display: false
        },
        tooltips: {
          // ...
          // Les options pour les tooltips
          // ...
        }
      }
    });
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données JSON:', error);
  });
