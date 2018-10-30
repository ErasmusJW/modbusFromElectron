// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


//export { kont }; 

const ipPrefix = "192.168.0.";

let KnownLfCardList = 
[
    {
        "ip" :ipPrefix + "202",
        "name" :"WManage"
    },
    {
        "ip" :ipPrefix + "203",
        "name" :"Overlay CManage"
    },
    {
        "ip" :ipPrefix + "204",
        "name" :"HManage"
    },
    {
        "ip" :ipPrefix + "205",
        "name" :"Underlay WManage"
    },
    {
        "ip" :ipPrefix + "206",
        "name" :"Underlay CManage"
    },
    {
        "ip" :ipPrefix + "207",
        "name" :"Underlay HManage"
    }
]


// let KnownLfCardList = 
// [

//     {
//         "ip" :ipPrefix + "206",
//         "name" :"Underlay CManage Address"
//     }
// ]

var ModbusRTU = require("modbus-serial");
let PingList = [];
setTimeout(createObject,100);

function createObject()
{
    let container = document.getElementById("MainTable");
    for(let i = 0 ; i < KnownLfCardList.length ; ++i)
    {
        let ip = KnownLfCardList[i].ip;
        let name = KnownLfCardList[i].name;
        
        KnownLfCardList[i]["modBus"] = new ModbusRTU();
        let p = document.createElement("tr");
        p.id = KnownLfCardList[i].ip;
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
           
  

  
        `
        container.appendChild(p);  
    }
    ConnectObject();
}

function ConnectObject()
{
    
    for(let i = 0 ; i < KnownLfCardList.length ; ++i)
    {
        ConnectedModbus(KnownLfCardList[i])
        PingList.push(KnownLfCardList[i].ip)
        
    }

    PinallCards();
    setInterval(PinallCards,2000);
        

}
function PinallCards()
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

function ConnectedModbus(Obj)
{
    console.log("COnnecting " + Obj.ip);
    
    //let Obj.modBus = Obj.modBus;
    let ip = Obj.ip;
    Obj.modBus.close();

    setTimeout(()=>{
        Obj.modBus.connectTCP(Obj.ip, { port: 502 })
        .then(()=>{
            setConProperties(Obj)
            console.log("Connected");
            UpdateConnected(Obj,true);
 
            setTimeout(()=>{ReadHolding(Obj)},100) 
        })
        .catch((e)=> {
            console.log(e.message);
            console.log(Obj)
            console.log("connection Error Reconecting")
            UpdateConnected(Obj,false);
            setTimeout(()=>{ConnectedModbus(Obj)},3000) 
        });

    },500);   
}


function ReadHolding(Obj)
{
    console.log("read Holding")
    console.log(Obj);
    //let Obj.modBus = Obj.modBus;
    Obj.modBus.readHoldingRegisters(0, 10)
    .then((data)=>{
        
        console.log(data.data);
        UpdateConnected(Obj,true);
        UpdateData(Obj,data.data);
        setTimeout(()=>{ReadHolding(Obj)},2000);
    }).catch(
        
       (reason) => {
            
            console.log('Handle rejected promise ('+reason+') here.');
            console.log(reason);
            setTimeout(()=>{ConnectedModbus(Obj)},3000) 
            UpdateConnected(Obj,false);
            
    });;

}

function UpdateConnected(Obj,connected)
{
    
    let id = Obj.ip + "Conection";
    let container = document.getElementById(id);
    let container2 = document.getElementById(Obj.ip);
    
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

function UpdateData(Obj,data)
{
    
    let idFreq = Obj.ip + "Freq";
    let containerFreq = document.getElementById(idFreq);
    containerFreq.innerHTML = `<p style='color: green;'>${data[0]}</p>`;

    let iddeviation= Obj.ip + "deviation";
    let containerDev = document.getElementById(iddeviation);
    containerDev.innerHTML = `<p style='color: green;'>${data[1]}</p>`;

    let idbaud = Obj.ip + "baud";
    let containerBaud = document.getElementById(idbaud);
    containerBaud.innerHTML = `<p style='color: green;'>${data[2]}</p>`;
        


}



function setConProperties(Obj) {
    
    let id = parseInt(Obj.ip.substring(Obj.ip.length -3));
    console.log("set con prop  ");
    console.log(id);
    Obj.modBus.setID(id);
    Obj.modBus.setTimeout(2800);


}



var ping = require('ping');

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


// setInterval(function() {
//     client.writeRegister(0,2600 ,function(err, data) {
//         console.log(err);
//         console.log(data);
//     }) 
// }, 3000);
