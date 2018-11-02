// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


//export { kont }; 

const ipPrefix = "192.168.0.";
var ModbusRTU = require("modbus-serial");

var ping = require('ping');

//template engine or Framewrok
let setFrequencyHtml = `<div class="form-group">
<label for="SetFrequency" class="col-form-label">Frequency:</label>
<select class="form-control" id="SetFrequency" >
    <option value="1550" style="color : brown;">Set 1 Brown 1550 </option>
    <option value="1630" style="color : red;">Set 2 Red 1630 </option>
    <option value="1710" style="color : orange;">Set 3 Orange 1710 </option>
    <option value="1790" style="color : Gold ;">Set 4 Yellow 1790 </option>
    <option value="1870" style="color : green;">Set 5 Green 1870 </option>
    <option value="1950" style="color : blue;">Set 6 Blue 1950 </option>
    <option value="2030" style="color : violet;">Set 7 Violet 2030 </option>
    <option value="2110" style="color : DarkGrey ;">Set 8 Grey 2110 </option>
    <option value="2190" style="color : grey;">Set 9 White 2190 </option>
    <option value="2270" style="color : black;">Set 10 Black 2270 </option>
    <option value="2350" style="color : Bisque ;">Set 11 Beige 2350 </option>
    <option value="2430" style="color : pink;">Set 12 Pink 2430 </option>
</select> 
</div>`

let setDeviationHtml = `
    <div class="form-group">
        <label for="Deviation">Deviation:</label>
        <input type="number"  min="10" max="100" class="form-control" id="SetDeviation" value="15" required>
    </div>
`

let baudHtml =`          <div class="form-group">
<label for="Baud">Baud Rate:</label>
<input type="number"  min="4800" max="57600" class="form-control" id="SetBaud" value="7200" required>
</div>  `


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }


let RegisterMap = 
{ 
    "LfStandAlone" : {
        "firmwareVersion" : 3.6,
        "protocolVersion" : 1,
        "InputResgisterMap" : [
            "BatteryVolts",             
            "BatteryTemp",              
            "Unsed",                
            "Unsed",                
            "Analog1",              
            "AnalogX",              
            "AnalogY",              
            "AnalogZ",
            "Firmware",
            "MAC1",               
            "MAC2",
            "MAC3"
        ],
        "HoldingResiterMap" : 
        [           
            {
                "name" :"Frequency",
                "InputElement" : setFrequencyHtml,
            },
            {
                "name" :"Deviation",
                "InputElement" : setDeviationHtml
            },
            {
                "name" :"Baud",
                "InputElement" : baudHtml
            }
        ]

    },
    "LfHeadGear" : {
        "firmwareVersion" : 3.6,
        "protocolVersion" : 1,
        "InputResgisterMap" : [
            "BatteryVolts",             
            "BatteryTemp",              
            "SupplyVoltage",                
            "Firmware",                
            "MAC1",              
            "MAC2",              
            "MAC3",              
            "RSSIvalAverage"
        ],
        "HoldingResiterMap" : 
        [           
            {
                "name" :"Frequency",
                "InputElement" : setFrequencyHtml,
            },
            {
                "name" :"Deviation",
                "InputElement" : setDeviationHtml
            },
            {
                "name" :"Baud",
                "InputElement" : baudHtml
            }
        ]

    }  
}



let KnownLfCardList = 
[
    {
        "ip" :ipPrefix + "202",
        "type" : "LfHeadGear",
        "name" :"WManage"
    },
    {
        "ip" :ipPrefix + "203",
        "type" : "LfStandAlone",
        "name" :"Overlay CManage"
    },
    {
        "ip" :ipPrefix + "204",
        "type" : "LfHeadGear",
        "name" :"HManage"
    },
    {
        "ip" :ipPrefix + "205",
        "type" : "LfHeadGear",
        "name" :"Underlay WManage"
    },
    {
        "ip" :ipPrefix + "206",
        "type" : "LfStandAlone",
        "name" :"Underlay CManage"
    },
    {
        "ip" :ipPrefix + "207",
        "type" : "LfHeadGear",
        "name" :"Underlay HManage"
    }
]

//pff who needs classes when your lazy
function addModbusClient()
{
    for(let obj of KnownLfCardList)
    {
        obj["modBus"] = new ModbusRTU();
    }
}

function AddToTableFunc(tableBody)
{
    let p = document.createElement("tr");
    let ip = this.ip;
    let name = this.name;
    p.id = ip;
    p.classList.add("table-warning");
    p.innerHTML = 
    `
        <td>${ip} </td>
        <td>${name} </td>
        <td id="${ip}Conection">Connecting</td>
        <td id="${ip}Ping">Connecting</td>
        <td id="${ip}Firmware">N/A</td>

        <td>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#setHoldingRegister" data-destip="${ip}">Set</button>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#viewHoldingRegister" data-destip="${ip}">View</button>
        </td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#viewInputRegisterModal" data-destip="${ip}">View</button></td> 
    `
    tableBody.appendChild(p); 
}



function GetFirmware()
{
    console.log("GetFirmWare")

    //let Obj.modBus = Obj.modBus;
    this.modBus.readInputRegisters(this.firmwareIndex, 1)
    .then((data)=>{
        
        console.log(data.data);
        UpdateConnected.call(this,true);
        
        let idFirmware = this.ip + "Firmware";
        let firmwareContainer = document.getElementById(idFirmware);
        let firmWareVersionMajor = data.data[0] >> 8;
        let firmWareVersionMinor = (data.data[0] & 0xff) /10;
        let firmwareTotal = firmWareVersionMajor + firmWareVersionMinor;

        firmwareContainer.innerHTML = `<p style='color: green;'>${firmwareTotal}</p>`;   
        setTimeout(()=>{GetFirmware.call(this)},1000 + getRandomInt(0,50)) 
    }).catch(
        
       (reason) => {
            
            console.log('Handle rejected promise ('+reason+') here.');
            console.log(reason);
            setTimeout(()=>{ConnectedModbus.call(this)},1500 + getRandomInt(0,25)) 
            UpdateConnected.call(this,false);
            
    });;
}

function ConnectedModbus()
{
    console.log("COnnecting " + this.ip);
    
    //let Obj.modBus = Obj.modBus;
    let ip = this.ip;
    this.modBus.close();

    setTimeout(()=>{
        this.modBus.connectTCP(this.ip, { port: 502 })
        .then(()=>{
            setConProperties.call(this)
            console.log("Connected");
            UpdateConnected.call(this,true);
 
            setTimeout(()=>{GetFirmware.call(this)},100) 
        })
        .catch((e)=> {
            console.log(e.message);

            console.log("connection Error Reconecting")
            UpdateConnected.call(this,false);
            setTimeout(()=>{ConnectedModbus.call(this)},1500 + getRandomInt(0,25)) 
        });

    },500);   
}

function setConProperties() {
    
    let id = parseInt(this.ip.substring(this.ip.length -3));
    console.log("set con prop  ");
    console.log(id);
    this.modBus.setID(id);
    this.modBus.setTimeout(2800);


}

function UpdateConnected(connected)
{
    
    let id = this.ip + "Conection";
    let container = document.getElementById(id);
    let container2 = document.getElementById(this.ip);
    
    if(connected)
    {
        container.innerHTML = "<p style='color: green;'>True</p>";

        container2.classList.remove("table-warning");
        container2.classList.add("table-success");
    


    }else{
        container.innerHTML = "<p style='color: red;'>False</p>";

        container2.classList.remove("table-success");
        container2.classList.add("table-warning");
    
    }
   
    

}

//make promise inorder to only call once previous executed or look async shit
function ReadHolding()
{
    console.log("read Holding")

    //let Obj.modBus = Obj.modBus;
    this.modBus.readHoldingRegisters(0, this.InputRegister.length)
    .then((data)=>{
        
        console.log(data.data);
        for(let val in data.data)
        {
            let id ="HoldingReg" +val;
            document.getElementById(id).innerHTML = data.data[val]
        }
    }).catch(
        
       (reason) => {
            
        console.log('Handle rejected promise ('+reason+') here.');
        console.log(reason);
            
    });;

}

function ReadInputRegisters()
{
    console.log("read Input")

    //let Obj.modBus = Obj.modBus;
    
    this.modBus.readInputRegisters(0, this.InputRegister.length)
    .then((data)=>{
        
        console.log(data.data);
        for(let val in data.data)
        {
            let id ="InputReg" +val;
            document.getElementById(id).innerHTML = data.data[val]
        }
        

    }).catch(
        
       (reason) => {
            
            console.log('Handle rejected promise ('+reason+') here.');
            console.log(reason);

            
    });;

}


function UpdateData(data)
{
    
    let idFreq = this.ip + "Freq";
    let containerFreq = document.getElementById(idFreq);
    containerFreq.innerHTML = `<p style='color: green;'>${data[0]}</p>`;

    let iddeviation= this.ip + "deviation";
    let containerDev = document.getElementById(iddeviation);
    containerDev.innerHTML = `<p style='color: green;'>${data[1]}</p>`;

    let idbaud = this.ip + "baud";
    let containerBaud = document.getElementById(idbaud);
    containerBaud.innerHTML = `<p style='color: green;'>${data[2]}</p>`;
        


}



// 


function PinallCards(PingList)
{
    PingList.forEach(function(host){
        ping.sys.probe(host, function(isAlive)
        {
            SetPing(isAlive,host )

        });
    });
    
}

function SetPing(val,ip)
{
    let id = ip + "Ping";
    let container = document.getElementById(id);

    
    if(val)
    {
        container.innerHTML = "<p style='color: green;'>True</p>";


    }else{
        container.innerHTML = "<p style='color: red;'>False</p>";


    
    }
}





//document . ready = it's been a while
$( document ).ready(function() 
{
    let pingList = [];
    
    addModbusClient();
    let container = document.getElementById("MainTable");
    for(let obj of KnownLfCardList)
    {
        let firmwareIndex = RegisterMap[obj.type].InputResgisterMap.findIndex(function(name){return name == "Firmware"});
        obj.firmwareIndex = firmwareIndex;
        
        AddToTableFunc.call(obj,container)
        ConnectedModbus.call(obj)
        pingList.push(obj.ip)
    }


    setInterval(()=>{PinallCards(pingList)},2000);

});













  $('#setHoldingRegister').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('destip') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('Setting Holding Register ' + recipient)
    //modal.find('.modal-body input').val(recipient)
    var found = KnownLfCardList.find(function(element) {
        return element.ip == recipient;
    });
    if(!found)
        alert("Some how sending data to a unkown card please restart");
        $("#setHoldingRegisterFormBody").empty();
    for(let val of RegisterMap[found.type].HoldingResiterMap)
    {
        $("#setHoldingRegisterFormBody").prepend(val.InputElement);
    }

    $("#sendData").click(
        function(event) 
        {
            event.preventDefault();
            var found = KnownLfCardList.find(function(element) {
                return element.ip == recipient;
            });
            let RegisterValues = [];
            for(let val of RegisterMap[found.type].HoldingResiterMap)
            {
                debugger
                let value = $("#Set" + val.name).val()
                RegisterValues.push(value)
                
            }
           

            if(!found)
                alert("Some how sending data to a unkown card please restart");
            else
            {
                console.log("Sending Values")
                found.modBus.writeRegisters(0,RegisterValues, function(err, data) {
                            console.log(err);
                            console.log(data);
                        })


            }
                
        }
     )


  })


let MoveThisSomeHowIntoTheObject2;
$('#viewHoldingRegister').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('destip') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('Viewing Holding Register ' + recipient)
    //modal.find('.modal-body input').val(recipient)
    var found = KnownLfCardList.find(function(element) {
        return element.ip == recipient;
    });
    if(!found)
        alert("Some how viewing data to a unkown card please restart");
    
    let type = found.type;

    let tableBody = document.getElementById("viewHoldingRegisterBody");
    tableBody.innerHTML = "";
    let registerNames = RegisterMap[type].HoldingResiterMap;
    found.InputRegister = registerNames;
    

    debugger
    for(let valName in registerNames)
    {
        let p = document.createElement("tr");
        p.innerHTML = `
        <td> ${valName} </td>
        <td> ${registerNames[valName].name} </td>
        <td id="HoldingReg${valName}"> </td>
        `
        tableBody.append(p)
    }

        MoveThisSomeHowIntoTheObject2 = setInterval(function(){ReadHolding.call(found)},1000);


  })

let MoveThisSomeHowIntoTheObject ;
  $('#viewInputRegisterModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('destip') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('Viewing input register ' + recipient)

    inputRegisterTarget



    let tableBody = document.getElementById("InputRegisterTableBody");
    tableBody.innerHTML ="";

        
    var found = KnownLfCardList.find(function(element) {
        return element.ip == recipient;
    });
    if(!found)
        alert("Some how sending data to a unkown card please restart");
    else
    {
        let type = found.type;

        
        let registerNames = RegisterMap[type].InputResgisterMap;
        found.InputRegister = registerNames;
        
        let container = document.getElementById("cardType");
        container.innerHTML = `<p>Type : ${type } numRegister : ${registerNames.length}</p>`;
        
        for(let valName in registerNames)
        {
            let p = document.createElement("tr");
            p.innerHTML = `
            <td> ${valName} </td>
            <td> ${registerNames[valName]} </td>
            <td id="InputReg${valName}"> </td>
            `
            tableBody.append(p)
        }

         MoveThisSomeHowIntoTheObject = setInterval(function(){ReadInputRegisters.call(found)},1000);

    }



  })




  $('#viewInputRegisterModal').on('hide.bs.modal', function (event) {

    clearInterval(MoveThisSomeHowIntoTheObject);
  })

  
  $('#viewHoldingRegister').on('hide.bs.modal', function (event) {

    clearInterval(MoveThisSomeHowIntoTheObject2);
  })

