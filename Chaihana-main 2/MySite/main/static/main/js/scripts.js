let selectedTable = 1;
function changePanelName(name) {
    selectedTable = name;
    document.getElementById('panel').innerText = `Стол ${name}`;
    loadOrders();
}
function loadOrders() {
    // Fetch orders from the server for the selected table and display them
    let Sum = 0
    fetch(`/load_orders/?table_number=${selectedTable}`)
      .then(response => response.json())
      .then(data => {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = ''; // Clear current orders
        //headers
        const hed = document.createElement('tr');
        const headerItem = document.createElement('td');
        headerItem.innerText = `Заказ`;
        headerItem.classList.add('td-header');
        const headerCount = document.createElement('td');
        headerCount.innerText = `Количество`;
        headerCount.classList.add('td-header');
        const headerPrice = document.createElement('td');
        headerPrice.innerText = `Стоимость`;
        headerPrice.classList.add('td-header');
        orderList.appendChild(hed);
        hed.appendChild(headerItem)
        hed.appendChild(headerCount)
        hed.appendChild(headerPrice)
        //data
        data.orders.forEach(order => {
          const rowe = document.createElement('tr');
          const orderItem = document.createElement('td');
          orderItem.innerText = `${order.dish_name}`;
          orderItem.classList.add('td-order');
          const orderCount = document.createElement('td');
          orderCount.innerText = `${order.count} шт.`;
          orderCount.classList.add('td-order');
          const orderPrice = document.createElement('td');
          orderPrice.innerText = `${order.price} руб.`;
          orderPrice.classList.add('td-order');
          orderList.appendChild(rowe);
          rowe.appendChild(orderItem);
          rowe.appendChild(orderCount);
          rowe.appendChild(orderPrice);
          Sum+=order.price;
        });
        const Res = document.createElement('tr');
        const result = document.createElement('td');
        result.innerText = 'Сумма';
        result.classList.add('td-header')
        const resSum = document.createElement('td');
        resSum.innerText = `${Sum} руб.`;
        resSum.classList.add('td-header')
        orderList.appendChild(Res);
        Res.appendChild(result);
        Res.appendChild(document.createElement('td'))
        Res.appendChild(resSum);
      });
}
  
function addOrder() {
    const dishId = document.getElementById('dish-select').value;
    const count = 1; // Default count for now, you can make this dynamic
  
    fetch('/add_order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') // Include CSRF token for security
      },
      body: JSON.stringify({
        table_number: selectedTable,
        dish_id: dishId,
        count: count
      })
    }).then(response => {
      loadOrders(); // Reload orders after adding
    });
}
  
function clearOrders() {
    fetch('clear_orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') // Include CSRF token for security
      },
      body: JSON.stringify({ table_number: selectedTable })
    }).then(response => {
      loadOrders(); // Reload orders after clearing
    });
}


let tableCount = 0;
let currentRow = 0;
let tablesInCurrentRow = 0;

document.addEventListener('DOMContentLoaded', ()=> {
    fetch('/tables')
        .then(response => response.json())
        .then(data => {
            data.forEach((table, index) => {
                tableCount = table; // Assuming the table ID is used for counting
                addExistingTable(`Стол ${tableCount}`);
            });
        });
});

function addExistingTable(name) {
    const t = tableCount;
    const table = document.getElementById('table');
    const row = document.getElementById(`row-${currentRow}`);
    const newCell = document.createElement('td');
    const newButton = document.createElement('button');
    newButton.classList.add('tablestyle');
    newButton.id = `Стол ${tableCount}`
    newButton.innerText = `Стол ${tableCount}`;
    newButton.onclick = function() {
        changePanelName(`${t}`);
    };
    newCell.appendChild(newButton);
    row.insertBefore(newCell, row.lastElementChild);

    tablesInCurrentRow++;
    if (tablesInCurrentRow === 5) {
        tablesInCurrentRow = 0;
        currentRow++;
        const tbody = document.getElementById('tbody');
        const newRow = document.createElement('tr');
        newRow.id = `row-${currentRow}`;
        const newCellPlus = document.createElement('td');
        newCellPlus.style.textAlign = 'center';
        newCellPlus.id='plus-cell';
        const plusButton = document.createElement('button');
        plusButton.onclick = addTable;
        plusButton.classList.add('tablestyle', 'fa-solid', 'fa-plus')
        newCellPlus.appendChild(plusButton);
        newRow.appendChild(newCellPlus);
        tbody.appendChild(newRow);
        table.appendChild(tbody);
        row.removeChild(document.getElementById('plus-cell'))
    }
}

/*function addTable() {
    tableCount++;
    tablesInCurrentRow++;

    const table = document.getElementById('table');
    const row = document.getElementById(`row-${currentRow}`);
    const newCell = document.createElement('td');
    const newButton = document.createElement('button');
    newButton.classList.add('tablestyle');
    newButton.innerText = `Стол ${tableCount}`;
    newButton.onclick = function() {
        changePanelName(`${newButton.innerText}`);
    };
    newCell.appendChild(newButton);
    row.insertBefore(newCell, row.lastElementChild);

    if (tablesInCurrentRow === 5) {
        tablesInCurrentRow = 0;
        currentRow++;
        const tbody = document.getElementById('tbody');
        const newRow = document.createElement('tr');
        newRow.id = `row-${currentRow}`;
        const newCellPlus = document.createElement('td');
        newCellPlus.style.textAlign = 'center';
        newCellPlus.id='plus-cell';
        const plusButton = document.createElement('button');
        plusButton.onclick = addTable;
        plusButton.classList.add('tablestyle', 'fa-solid', 'fa-plus')
        newCellPlus.appendChild(plusButton);
        newRow.appendChild(newCellPlus);
        tbody.appendChild(newRow);
        table.appendChild(tbody);
        row.removeChild(document.getElementById('plus-cell'))
    }
}*/

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function addTable() {
    tableCount++;
    tablesInCurrentRow++;

    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ number: tableCount})
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {  
            const t = tableCount;      
            const table = document.getElementById('table');
            const row = document.getElementById(`row-${currentRow}`);
            const newCell = document.createElement('td');
            const newButton = document.createElement('button');
            newButton.classList.add('tablestyle');
            newButton.id = `Стол ${tableCount}`
            newButton.innerText = `Стол ${tableCount}`;
            newButton.onclick = function() {
                changePanelName(`${t}`);
            };
            newCell.appendChild(newButton);
            row.insertBefore(newCell, row.lastElementChild);

            if (tablesInCurrentRow === 5) {
                tablesInCurrentRow = 0;
                currentRow++;
                const tbody = document.getElementById('tbody');
                const newRow = document.createElement('tr');
                newRow.id = `row-${currentRow}`;
                const newCellPlus = document.createElement('td');
                newCellPlus.style.textAlign = 'center';
                newCellPlus.id='plus-cell';
                const plusButton = document.createElement('button');
                plusButton.onclick = addTable;
                plusButton.classList.add('tablestyle', 'fa-solid', 'fa-plus')
                newCellPlus.appendChild(plusButton);
                newRow.appendChild(newCellPlus);
                tbody.appendChild(newRow);
                table.appendChild(tbody);
                row.removeChild(document.getElementById('plus-cell'))
            }
        } 
        else {
            console.error('Ошибка добавления стола:', data.error);
        }
    })
    location.href=location.href
    .catch(error => console.error('Ошибка добавления стола:', error));
}

function MakeRed(){
    label = document.getElementById('panel').innerText
    if(label == 'Выберите стол'){
        return
    }
    else{
        tab = document.getElementById(`${label}`)
        tab.classList.add('tablestyleRed')
        tab.classList.remove('tablestyle')
    }
}
function MakeGreen(){
    label = document.getElementById('panel').innerText
    if(label == 'Выберите стол'){
        return
    }
    else{
        tab = document.getElementById(`${label}`)
        tab.classList.add('tablestyle')
        tab.classList.remove('tablestyleRed')
    }
}