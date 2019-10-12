"use strict";
/*form captcha */

function LoadScriptsCaptcha() {
    let spanCaptcha = document.getElementById("captcha");
    let inputCaptcha = document.getElementById("form-captcha");
    let bntRefreshCaptcha = document.getElementById("btn-captcha");
    let spanResult = document.getElementById("form-result");
    let form = document.getElementById("form-main");
    //functions
    function generateCaptcha() {
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

function TableContent() {

    let id = 0;
    let array = [];

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
    let lastModification=0;
    let size=0;
    async function getTableContent() {
        array = [];
        try {
            let response = await fetch('https://web-unicen.herokuapp.com/api/groups/g16/tpespecial/');
            if (response.ok) {
                let json = await response.json();
                if (lastModification == 0 && json.tpespecial.length > 0 ){///si es la primera vez que ejecuto 
                    lastModification= json.tpespecial[0].dateAdded;
                }
                size=json.tpespecial.length;
                for (let i = 0; i < json.tpespecial.length; i++) { 
                    if (id < json.tpespecial[i].thing.id) {
                        id = json.tpespecial[i].thing.id;
                    }
                   
                    if (lastModification <json.tpespecial[i].dateAdded){
                        lastModification=json.tpespecial[i].dateAdded;
                    }
                    array.push(json.tpespecial[i].thing);
                }
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function postTableContent(data) {
        let thing = {
            "thing": data
        };
        try {
            let response = await fetch('https://web-unicen.herokuapp.com/api/groups/g16/tpespecial/', {
                "method": "POST",
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(thing)
            });
            if (response.ok) {
                console.log("guardado")
            }
            else {
                console.log("No funciono posteo");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteTableContent(itemid) {

        try {
            let response = await fetch('https://web-unicen.herokuapp.com/api/groups/g16/tpespecial/'+itemid, {
                "method": "DELETE",
                "mode": "cors",
                "headers": { "Content-Type": "application/json" }
            });
            if (response.ok) {
                console.log("borre " + itemid);
            } else {
                console.log("no borre nada" + itemid);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getTableContentIds(item) {
        let result=[];
        try {
            let response = await fetch('https://web-unicen.herokuapp.com/api/groups/g16/tpespecial/');
            if (response.ok) {
                let json = await response.json();
                ///obtengo los ids 
                if (item == undefined) {//todos
                    for (let i = 0; i < json.tpespecial.length; i++) {
                        result.push(json.tpespecial[i]._id);
                    }
                }
                else {//solo 1
                    for (let i = 0; i < json.tpespecial.length; i++) {
                        if (item.id == json.tpespecial[i].thing.id) {
                            result.push(json.tpespecial[i]._id);
                        }
                    }
                }
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    }


     function updateTableApi(data) {
        let thing = {
            "thing": data
        };
         let itemid = getTableContentIds(data);///obtengo el _id de la api

         itemid.then(async function (result) {//utilizo el id obtenido
             try {
                 let response = await fetch('https://web-unicen.herokuapp.com/api/groups/g16/tpespecial/' + result, {
                     "method": "PUT",
                     "headers": { "Content-Type": "application/json" },
                     "body": JSON.stringify(thing)
                 }
                 );
                 if (response.ok) {
                     console.log('update con exito'+result);
                 }
                 else {
                     console.log("No funciono el update");
                 }
             } catch (error) {
                 console.log(error);
             }
         });
    }

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

    function updateTable(data,tableposition) {
        let tam = array.length - 1;
        let item;
        if (data==undefined){
            item= array[tam];
        }else{
            item=data;
        }

        if (filterActive && item.launcher.indexOf(textFilter.value) > -1) {
            updateRow(item, tableposition);
            highlightRow(tableposition);
        }
        if (!filterActive) {
            updateRow(item, tableposition);
            highlightRow(tableposition);
        }
    }
    function deletebtn() {
        let i = 0;
        array.forEach(item => {
            if (item.id == this.parentElement.id) {
                let ids=getTableContentIds(item);
                ids.then(async function(id){deleteTableContent(id)});
                array.splice(i, 1);
            }
            i++;
        });
        this.parentElement.parentElement.remove();
    }

    function currentRow(id) {
        let i = 0;
        let indexrow = 0;
        let rows = tbody.querySelectorAll("tr"); ///seleccionar la posicion de la tabla 
        rows.forEach(item => {
            if (item.cells[5].id == id) {
                indexrow = i;
                return indexrow;
            }
            i++;
        })
        return indexrow;
    }
    let edit=false;
    
    let toupdateindex = 0; //indice en el arreglo

    function editbtn() {

        ///otra posible solucion es asignar los valores de la tabla al form para poder agregarlo de ahi y remover el resto de la tabla mas prolijo mejos tiempo de procesamiento
        edit=true;
        this.previousSibling.classList.remove("d-none");//visible boton save
        this.classList.add("d-none");//invisible este
        ///desabilito edits and delete
        let edits = tbody.querySelectorAll(".edit");
        edits.forEach(item => {
            if (item.parentElement.id != this.parentElement.id) {
                item.classList.add("disable");
            }
        });
        let delets = tbody.querySelectorAll(".delete");
        delets.forEach(item => {
            if (item.parentElement.id != this.parentElement.id) {
                item.classList.add("disable");
            }
        });

        let i = 0;
        let indexrow = currentRow(this.parentElement.id);
        let currentrow = tbody.rows[indexrow];

        array.forEach(item => {
            if (item.id == this.parentElement.id) {
                ///problema luego de cambiar y eliminar un elemento no crea inputs
                currentrow.cells[0].innerHTML = '<input type="text" name="" id="launcher" value="' + item.launcher + '">';
                currentrow.cells[1].innerHTML = '<input type="text" name="" id="client" value="' + item.client + '">';
                currentrow.cells[2].innerHTML = '<input type="text" name="" id="place" value="' + item.place + '">';
                currentrow.cells[3].innerHTML = '<input type="text" name="" id="vehicle" value="' + item.vehicle + '">';
                currentrow.cells[4].innerHTML = '<input type="text" name="" id="objetive" value="' + item.objective + '">';
               
                toupdateindex = i;
            }
            i++;
        });


        // currentrow.querySelector(".save").addEventListener('click', savebtn);

        // currentrow.querySelector(".edit").addEventListener('click', editbtn);

        // currentrow.querySelector(".delete").addEventListener('click', deletebtn);

    }

    function savebtn() {
        this.nextSibling.classList.remove("d-none");//visible boton edit
        this.classList.add("d-none");//invisible guardar
        let row = this.parentElement.parentElement;
        let inputs = row.querySelectorAll("input[type=text]");

        let launcher = inputs[0].value;
        let client = inputs[1].value;
        let place = inputs[2].value;
        let vehicle = inputs[3].value;
        let objective = inputs[4].value;

        let data = {
            "id": this.parentElement.id,
            "launcher": launcher,
            "client": client,
            "place": place,
            "vehicle": vehicle,
            "objective": objective
        };


        let position = currentRow(this.parentElement.id);
        

        array[toupdateindex] = data;/// reeemplazo  en arreglo la data
        updateTableApi(data);  //hacer update utilizar toupdate
        updateTable(data,position);
        //rehabilito todos los edits and delete
        let edits = tbody.querySelectorAll(".edit");
        edits.forEach(item => {
            if (item.parentElement.id != this.parentElement.id) {
                item.classList.remove("disable");
            }
        });
        let delets = tbody.querySelectorAll(".delete");
        delets.forEach(item => {
            if (item.parentElement.id != this.parentElement.id) {
                item.classList.remove("disable");
            }
        });
        
        edit=false;
    }

    function updateRow(item, position) {
        let toadd = '<tr>' +
            '<td>' + item.launcher + '</td>' +
            '<td>' + item.client + '</td>' +
            '<td>' + item.place + '</td>' +
            '<td>' + item.vehicle + '</td>' +
            '<td>' + item.objective + '</td>';
        toadd += '<td class="d-flex border-bottom-0 border-left-0 border-right-0" id="' + item.id + '"  >'
            + '<a class="save d-none" title="" data-toggle="tooltip" data-original-title="Save"  ><i class="far fa-save fa-lg table-logo" alt="Save"></i></a>'
            + '<a class="edit" title="" data-toggle="tooltip" data-original-title="Edit" ><i class="far fa-edit fa-lg table-logo" alt="Edit"></i></a>'
            + '<a class="delete" title="" data-toggle="tooltip" data-original-title="Delete" ><i class="far fa-trash-alt fa-lg table-logo" alt="Delete"></i></a>'
            + '</td>' + '</tr>';
        let indexrow
        if (position == undefined) {
            tbody.insertRow(-1).innerHTML = toadd;
            //indexrow = currentRow(item.id); optimizar no preguntar cada vez
            indexrow=tbody.rows.length-1;
        } else {
            tbody.rows[position].innerHTML = toadd;
            indexrow=position;
        }///modificar una fila en posicion
        
         ////error por guardar algo don otro id
        let currentrow = tbody.rows[indexrow];
     
        currentrow.querySelector(".delete").addEventListener("click", deletebtn);
        currentrow.querySelector(".edit").addEventListener("click", editbtn);
        currentrow.querySelector(".save").addEventListener("click", savebtn);

    }

    function saveInput() {
        id++;
        let inputs = formAddTable.querySelectorAll("input[type=text]");
        let launcher = inputs[0].value;
        let client = inputs[1].value;
        let place = inputs[2].value;
        let vehicle = inputs[3].value;
        let objective = inputs[4].value;

        let data = {
            "id": id,
            "launcher": launcher,
            "client": client,
            "place": place,
            "vehicle": vehicle,
            "objective": objective
        };
        array.push(data);
        postTableContent(data);
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
        let ids=getTableContentIds();
        ids.then(function(result){
            result.forEach(itemid=>{
                deleteTableContent(itemid);
            })
        })
        array = [];
        id = 0;
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
        id++;
        let row1 = { "id": id, "launcher": "Principios 2019", "client": "Fuerza Aérea de los Estados Unidos", "place": "Centro Espacial Kennedy, Florida", "vehicle": "Falcon Heavy", "objective": "Misión del Programa de Pruebas Espaciales de la USAF-2 Venta de lanzamiento a determinar" };
        postTableContent(row1);
        array.push(row1);
        updateTable();

        id++;
        let row2 = { "id": id, "launcher": "5/7/2019", "client": "NASA", "place": "Cabo Cañaveral Florida", "vehicle": "Falcon 9/Dragon", "objective": "Vuelo de entrega de carga de Dragon a la Estación Espacial Internacional. Fecha de lanzamiento a determinar" };
        postTableContent(row2);
        array.push(row2);
        updateTable();

        id++;
        let row3 = { "id": id, "launcher": "10/2019", "client": "Fuerza Aérea de los Estados Unidos", "place": "Cabo Cañaveral Florida", "vehicle": "Falcon 9", "objective": "Lanzamiento del tercer sátelite de navegación GPS III" };
        postTableContent(row3);
        array.push(row3);
        updateTable();

    }
    btnadd3rows.addEventListener("click", add3rows);
    function highlightRow(position) {
        let row = 0;
        if (position == undefined) {
            row = tbody.lastChild;
        } else {
            row = tbody.rows[position];
        }

        if (row.firstChild.nextSibling.nextSibling.innerText == filterPlaceLauncher) {
            row.classList.add("highlight");
        }else{
            row.classList.remove("highlight");
        }

    }

    function compareArrays(input){
        array.forEach(item => {
            if (!input.includes(item)){
                return true;
            }
        });
        return false;
    }

    getTableContent().then(function(){loadTable(array)});
    setInterval(function(){
        if (edit == false ){
            //opcion verificar items modificados muy costoso solo editar los items que no estan
            // console.log('last modification sin change '+lastModification);
            let currentTime=lastModification;
            let currentSize=size;
            let currentArray = array;
            getTableContent().then(function(){          
            // console.log('last modification '+lastModification+' current time '+currentTime);
            let update = compareArrays(currentArray);
         
            if (lastModification!=currentTime || size!=currentSize || update){
                if ( !filterActive){
                    deleteTable();
                    loadTable(array);
                }else{
                    deleteTable();
                    let response = filter();
                    loadTable(response);
                }
            }});
        }
    },10000);
}

function loadPage() {
    LoadScriptsCaptcha();
    TableContent();
}

document.addEventListener('DOMContentLoaded', loadPage);