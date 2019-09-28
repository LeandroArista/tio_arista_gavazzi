"use strict";
/*form captcha */

function LoadScriptsCaptcha() {
    let spanCaptcha = document.getElementById("captcha");
    let inputCaptcha = document.getElementById("form-captcha");
    let bntRefreshCaptcha = document.getElementById("btn-captcha");
    let spanResult = document.getElementById("form-result");
    let form = document.getElementById("form-main");
     //functions
    function generateCaptcha(){
        const min = 0;
        const max = 9999;
        let numCaptcha = generateRandom(min, max);
        spanCaptcha.innerHTML = numCaptcha;
    }
    generateCaptcha();
    function validateCaptcha() {
        if (inputCaptcha.value != spanCaptcha.innerText) {
            inputCaptcha.classList.remove("is-invalid");
            inputCaptcha.classList.remove("is-valid");
            inputCaptcha.className += " is-invalid";
            event.preventDefault();
            return false;
        }
        inputCaptcha.classList.remove("is-invalid");
        spanResult.className += " is-valid";
        return true;
    }

    function generateRandom(min, max) {
        let num = (Math.floor(Math.random() * (max - min) + min));
        switch (getNumberOfDigits(num)) {
            case (1):
                num = "000" + num;
                break;
            case (2):
                num = "00" + num;
                break;
            case (3):
                num = "0" + num;
                break;
            case (4):

                num = num;
            default:
                break;
        }
        return num;
    }
    function checkLength() {
        const maxlength = 4;
        if (this.value.length > maxlength) {
            this.value = this.value.slice(0, maxlength);
        }
    }
    function getNumberOfDigits(number) {
        if (number < 10) {
            return 1;
        }
        else if (number < 100) {
            return 2;
        }
        else if (number < 1000)
            return 3;
        else
            return 4;
    }

    //addEventListener
    inputCaptcha.addEventListener('input', checkLength);
    form.addEventListener('submit', validateCaptcha);
    bntRefreshCaptcha.addEventListener("click", generateCaptcha);
}

/* table buttons*/

function loadPage() {
    LoadScriptsCaptcha() ;
    let id = 2;
    let array = [
        { "id": 0, "launcher": "Principios 2019", "client": "Fuerza Aérea de los Estados Unidos", "place": "Centro Espacial Kennedy, Florida", "vehicle": "Falcon Heavy", "objective": "Misión del Programa de Pruebas Espaciales de la USAF-2 Venta de lanzamiento a determinar" },
        { "id": 1, "launcher": "5/7/2019", "client": "NASA", "place": "Cabo Cañaveral Florida", "vehicle": "Falcon 9/Dragon", "objective": "Vuelo de entrega de carga de Dragon a la Estación Espacial Internacional. Fecha de lanzamiento a determinar" },
        { "id": 2, "launcher": "10/2019", "client": "Fuerza Aérea de los Estados Unidos", "place": "Cabo Cañaveral Florida", "vehicle": "Falcon 9", "objective": "Lanzamiento del tercer sátelite de navegación GPS III" }
    ];
    
    let btnaddrow = document.getElementById("add1");
    let btnadd3rows = document.querySelector("#add3");
    let btnDeltable = document.getElementById("deltable");

    let table = document.getElementById("launcher-table");
    let tbody = table.querySelector("tbody");

    let btnSearch = document.querySelector("#search-launcher");
    let textFilter = document.querySelector("#filter-launcher");
    let btnDisableFilter = document.querySelector("#disable-filter");
    let formAddTable = document.getElementById("form-add-Table");
    let filterPlaceLauncher = "Cabo Cañaveral Florida";
    let filterActive = false;
    function filter() {
        let response = [];
        array.forEach(item => {
            if (item.launcher.indexOf(textFilter.value) > -1) {
                response.push(item);
            }
        });
        return response;
    }

    function deleteTable() {
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

    }

    function loadTable(arr) {
        arr.forEach((item) => {
            updateRow(item);
            highlightRow();
        })
    }
    
    function updateTable() {
        let tam = array.length - 1;
        let item = array[tam];
        if (filterActive && item.launcher.indexOf(textFilter.value) > -1) {
            updateRow(item);
            highlightRow();
        }
        if (!filterActive) {
            updateRow(item);
            highlightRow();
        }
    }
    function deletebtn() {
        let i = 0;
        array.forEach(item => {
            if (item.id == this.id) {
                array.splice(i, 1);
            }
            i++;
        });
        this.parentElement.parentElement.remove();
    }
    
    function updateRow(item) {
        let toadd = '<tr>' +
            '<td>' + item.launcher + '</td>' +
            '<td>' + item.client + '</td>' +
            '<td>' + item.place + '</td>' +
            '<td>' + item.vehicle + '</td>' +
            '<td>' + item.objective + '</td>';
        toadd += '<td>' + '<a class="delete" title="" data-toggle="tooltip" data-original-title="Delete" id="' + item.id + '"' + '><img src="./images/delete-forever-outline.png" alt="" class="table-logo"></a>';
        + '</td>' + '</tr>';
        tbody.insertRow(-1).innerHTML = toadd;
        let btndelete = table.querySelectorAll(".delete");
        btndelete[btndelete.length - 1].addEventListener("click", deletebtn);
    }
    
    function saveInput() {
        id++;
        let inputs = formAddTable.querySelectorAll("input[type=text]");
        let launcher = inputs[0].value;
        let client = inputs[1].value;
        let place = inputs[2].value;
        let vehicle = inputs[3].value;
        let objective = inputs[4].value;
        array.push({ "id": id, "launcher": launcher, "client": client, "place": place, "vehicle": vehicle, "objective": objective });
        updateTable();
    }
    
    //addEventListener
    btnaddrow.addEventListener("click", function () {
        saveInput();
        let inputs = formAddTable.querySelectorAll("input[type=text]");
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
        inputs[3].value = "";
        inputs[4].value = "";
    });
    btnDeltable.addEventListener('click', function () {
        deleteTable();
        array = [];
    });
    btnSearch.addEventListener('click', function () {
        let response = filter();
        deleteTable();
        loadTable(response);
        filterActive = true;
    });

    btnDisableFilter.addEventListener('click', function () {
        deleteTable();
        textFilter.value = "";
        filterActive = false;
        loadTable(array);

    })
    function add3rows() {
        for (let i = 0; i < 3; i++) {
            id++;
            let item = { "id": id, "launcher": "5/7/2019", "client": "NASA", "place": "Cabo Cañaveral Florida", "vehicle": "Falcon 9/Dragon", "objective": "Vuelo de entrega de carga de Dragon a la Estación Espacial Internacional. Fecha de lanzamiento a determinar" }
            array.push(item);
            updateTable();
        }
    }
    btnadd3rows.addEventListener("click", add3rows);
    function highlightRow() {
        let row = tbody.lastChild;
        if (row.firstChild.nextSibling.nextSibling.innerText == filterPlaceLauncher) {
            row.classList.add("highlight");
        }
    }
    loadTable(array);
}

document.addEventListener('DOMContentLoaded', loadPage);