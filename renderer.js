// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


//export { kont }; 

const ipPrefix = "192.168.0.";
var ModbusRTU = require("modbus-serial");

var ping = require('ping');




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
            "Frequency",
            "Deviation",
            "Baud"
        ]

    } 
}



let KnownLfCardList = 
[
    {
        "ip" :ipPrefix + "202",
        "type" : "LfStandAlone",
        "name" :"WManage"
    },
    {
        "ip" :ipPrefix + "203",
        "type" : "LfStandAlone",
        "name" :"Overlay CManage"
    },
    {
        "ip" :ipPrefix + "204",
        "type" : "LfStandAlone",
        "name" :"HManage"
    },
    {
        "ip" :ipPrefix + "205",
        "type" : "LfStandAlone",
        "name" :"Underlay WManage"
    },
    {
        "ip" :ipPrefix + "206",
        "type" : "LfStandAlone",
        "name" :"Underlay CManage"
    },
    {
        "ip" :ipPrefix + "207",
        "type" : "LfStandAlone",
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
        <td id="${ip}Freq"></td>
        <td id="${ip}deviation"></td>
        <td id="${ip}baud"></td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#setParametersModal" data-destip="${ip}">Set Lf parametes</button></td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#viewInputRegisterModal" data-destip="${ip}">View Input Register</button></td> 
    `
    tableBody.appendChild(p); 
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
 
            setTimeout(()=>{ReadHolding.call(this)},100) 
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


function ReadHolding()
{
    console.log("read Holding")

    //let Obj.modBus = Obj.modBus;
    this.modBus.readHoldingRegisters(0, 5)
    .then((data)=>{
        
        console.log(data.data);
        UpdateConnected.call(this,true);
        UpdateData.call(this,data.data);
        setTimeout(()=>{ReadHolding.call(this)},1000 + getRandomInt(0,10)) 
    }).catch(
        
       (reason) => {
            
            console.log('Handle rejected promise ('+reason+') here.');
            console.log(reason);
            setTimeout(()=>{ConnectedModbus.call(this)},1500 + getRandomInt(0,25)) 
            UpdateConnected.call(this,false);
            
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

        
        AddToTableFunc.call(obj,container)
        ConnectedModbus.call(obj)
        pingList.push(obj.ip)
    }


    setInterval(()=>{PinallCards(pingList)},2000);

});











$('#setParametersModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('destip') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('Setting parameters for ' + recipient)
    //modal.find('.modal-body input').val(recipient)

    $("#sendData").click(
        function(event) {
           let buad = $("#Buad").val();
           let Deviation = $("#Deviation").val();
           let SetFrequency = $("#SetFrequency").val();
           console.log(buad)
           console.log(Deviation)
           console.log(SetFrequency)
           event.preventDefault();
 

           var found = KnownLfCardList.find(function(element) {
                return element.ip == recipient;
            });
            if(!found)
                alert("Some how sending data to a unkown card please restart");
            else
            {
                console.log("Sending Values")
                found.modBus.writeRegisters(0,[SetFrequency,Deviation,buad], function(err, data) {
                            console.log(err);
                            console.log(data);
                        })


            }
                
        }
     )
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

    clearInterval(MoveThisSomeHowIntoTheObject)
    console.log("HEEEEELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLO");
    console.log("HEEEEELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLO");
    console.log("HEEEEELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLO");
    console.log("HEEEEELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLO");
    console.log("HEEEEELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLO");
    console.log("HEEEEELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLO");



  })


