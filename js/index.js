let response = await fetch('./js/data.json');
let data = await response.json();
// console.log(data);
let customers = data.customers;
// console.log(customers);
let transactions = data.transactions;
// console.log(transactions);

let assignObjects = {};
let assignObjectsArray = [];
let amountArray = [];
let dateArray= [];
let arrayWithoutDuplicatedDates=[];
let filteredArray = [];
const ctx = document.getElementById('myChart');
let graph = '';

function sumData(){
    for(let i = 0; i<customers.length ; i++){
        for(let y = 0 ; y<transactions.length ; y++){
            if(customers[i].id == transactions[y].customer_id){
                // console.log(customers[i].id, transactions[y].customer_id);
                assignObjects = Object.assign({},customers[i] ,transactions[y]);
                // console.log(assignObjects);
                assignObjectsArray.push(assignObjects);
            }
        }
    }
    return assignObjectsArray;
}
sumData()

function makeDatesInOneArray(){
    for(const date of assignObjectsArray){
        dateArray.push(date.date)
    }
    arrayWithoutDuplicatedDates = [...new Set(dateArray)];
    return arrayWithoutDuplicatedDates;
}

export function display(){
    let cartona = '';
    for(let i = 0 ; i< assignObjectsArray.length ; i++){
        cartona+=`
        <tr>
            <th scope="row">${assignObjectsArray[i].id}</th>
            <td>${assignObjectsArray[i].name}</td>
            <td>${assignObjectsArray[i].amount}</td>
            <td>${assignObjectsArray[i].date}</td>
        </tr>
        `
        document.querySelector('.tbody').innerHTML = cartona;
    }
    console.log();
}

function sortdefult() {
    assignObjectsArray.sort((a, b) => {
        return a.id - b.id;
    });
    display();
}
sortdefult()

function sortTable(key) {
    assignObjectsArray.sort(function(a, b){
        if (key === 'name') {
            return a[key].localeCompare(b[key]);
        } else {
            return a[key] - b[key];
        }
    });
    display();
}

$('.name').on('click', function(){
    sortTable('name')
})
$('.amount').on('click', function(){
    sortTable('amount')
})

function filterArray(inputValue) {
    let arrayFiltered = assignObjectsArray.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()))
    return arrayFiltered;
}

$('input').on('input', function() {
    let inputValue = $('input').val();
    filteredArray = filterArray(inputValue, assignObjectsArray);
    let cartona = '';
    filteredArray.forEach(item => {
        cartona += `
            <tr>
                <th scope="row">${item.id}</th>
                <td>${item.name}</td>
                <td>${item.amount}</td>
                <td>${item.date}</td>
            </tr>
        `;
    });
    document.querySelector('.tbody').innerHTML = cartona;
    if($('input').val() == ""){
        filteredArray = [];
        document.querySelector('.chart').classList.add("d-none");
        amountArray = [];
    }
    return filteredArray;
})

function makeAmountsInOneArray(){
    console.log(filteredArray);
    console.log(amountArray);
    if(amountArray != []){
        amountArray = []; 
    }
    for(const amount of filteredArray){
        amountArray.push(amount.amount)
    }
    console.log(amountArray);
    return amountArray;
    
}

$('.totalTransaction').on('click', function(){
    let transResult = $('input').val();
    if(transResult == ""){
        document.querySelector(".inputEmpty").classList.remove('d-none');
    }
    else{
        document.querySelector(".inputEmpty").classList.add('d-none');
        console.log(filteredArray);
        makeAmountsInOneArray();
        makeDatesInOneArray();
        if (graph) {
            graph.destroy();
        }
        chart();
    }
})

function chart(){
    document.querySelector('.chart').classList.remove('d-none');
    graph = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...arrayWithoutDuplicatedDates],
          datasets: [{
            label: $('input').val(),
            data: [...amountArray],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
    });
}
