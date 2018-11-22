// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


//export { kont }; 



function SetColourAndValueBunting(element,value)
{
  
  var classToRemove = ["dotActive", "dotNotActive"]
  element.classList.remove(...classToRemove);
  if(value)
  {
    element.classList.add("dotNotActive");

    
  }

  if(value == 0)
  {
    element.classList.add("dotActive");
    

  }

}















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
  
  
  
  
  
  
  
  
  
  
  
  
  
  


let CardTypemap = 
[
    "UNKOWN" ,
    "SPEECH_UNIT" ,
    "DIGITAL_UNIT" ,
    "ANALOG_UNIT" ,
    "MANAGEMENT_UNIT" ,
    "LOADCELL_UNIT" ,
    "MODBUS_UNIT" ,
    "ANALOG" ,
    "LF_STANDALONE" ,
    "SIX_WAY_LOADCELL" ,
    "INTEL_UNIT" ,
    "BAMABANANI_LOADCELL_UNIT" ,
    "DISPLAY_DRIVER" ,
    "LF_MANGEMENT_CAGE",
    "LF_MANGEMENT_HEADGER"
]

let RegisterMap = 
{ 
    "LF_STANDALONE" : {
        "firmwareVersion" : 3.6,
        "protocolVersion" : 1,
        "CoilMap" : [],
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
        "DiscreteInputMap" : [
            "Input0",
            "Input1",
            "Input2",
            "Input3",
            "Input4",
            "Input5",
            "Input6",
            "Input7",
            "BatteryFlag0-SupplyAvailable",
            "BatteryFlag1-LoadTestPerformed",
            "BatteryFlag2-BattHealthy",
            "BatteryFlag3-Low Voltage cut",
            "BatteryFlag4",
            "BatteryFlag5",
            "BatteryFlag6",
            "BatteryFlag7-Low Voltage Warning",            
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
    "LF_MANGEMENT_CAGE" : 
    {
        "firmwareVersion" : 2.6,
        "protocolVersion" : 1,
        "CoilMap" : [
            "Output0",
            "Output1"
        ],
        "InputResgisterMap" : [
            "BatteryVolts",             
            "BatteryTemp",              
            "UnintialisedByte",                
            "Firmware",                
            "MAC1",              
            "MAC2",              
            "Unsed",              
            "Unsed"

        ],
        "DiscreteInputMap" : [
            "Input0",
            "Input1",
            "Input2",
            "Input3",
            "Input4",
            "Input5",
            "Input6",
            "Input7",
            "BatteryFlag0-SupplyAvailable",
            "BatteryFlag1-LoadTestPerformed",
            "BatteryFlag2-BattHealthy",
            "BatteryFlag3-Low Voltage cut",
            "BatteryFlag4",
            "BatteryFlag5",
            "BatteryFlag6",
            "BatteryFlag7-Low Voltage Warning",            
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

const TypeRegisters = 250;

const ErrorsBeforReconnect = 3;

// let KnownLfCardList = 
// [
//     {
//         "ip" :ipPrefix + "202",
//         "PossibleTypes" : "LfHeadGear",
//         "type" : "UNKOWN",
//         "name" :"WManage"
//     },
//     {
//         "ip" :ipPrefix + "203",
//         "PossibleTypes" : "LfStandAlone",
//         "type" : "UNKOWN",
//         "name" :"Overlay CManage"
//     },
//     {
//         "ip" :ipPrefix + "204",
//         "PossibleTypes" : "LfHeadGear",
//         "type" : "UNKOWN",
//         "name" :"HManage"
//     },
//     {
//         "ip" :ipPrefix + "205",
//         "PossibleTypes" : "LfHeadGear",
//         "type" : "UNKOWN",
//         "name" :"Underlay WManage"
//     },
//     {
//         "ip" :ipPrefix + "206",
//         "PossibleTypes" : "LfStandAlone",
//         "type" : "UNKOWN",
//         "name" :"Underlay CManage"
//     },
//     {
//         "ip" :ipPrefix + "207",
//         "PossibleTypes" : "LfHeadGear",
//         "type" : "UNKOWN",
//         "name" :"Underlay HManage"
//     }
// ]

let KnownLfCardList = 
[

    {
        "ip" :ipPrefix + "203",
        "type" : "UNKOWN",
        "name" :"Overlay CManage",
        "PossibleTypes" : ["LF_MANGEMENT_CAGE","MANAGEMENT_UNIT","LF_STANDALONE"]
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
        <td id="${ip}Type">N/A</td>
        <td id="${ip}Firmware">N/A</td>
        <td>
            <button id="${ip}SetHolding" type="button" disabled class="btn btn-primary" data-toggle="modal" data-target="#setHoldingRegister" data-destip="${ip}">Set</button>
            <button id="${ip}GetHolding" type="button" disabled class="btn btn-primary" data-toggle="modal" data-target="#viewHoldingRegister" data-destip="${ip}">View</button>
        </td>
        <td>
            <button id="${ip}ViewInputRegister" type="button" disabled class="btn btn-primary" data-toggle="modal" data-target="#viewInputRegisterModal" data-destip="${ip}" data-maptodisplay="InputResgisterMap">
                view
            </button>
        </td>
        <td>
            <button id="${ip}ViewDiscreteInput" type="button" disabled class="btn btn-primary" data-toggle="modal" data-target="#viewInputRegisterModal" data-destip="${ip}" data-maptodisplay="DiscreteInputMap">
                View
            </button>
        </td> 
        <td>
            <button id="${ip}ViewColis" type="button" disabled class="btn btn-primary" data-toggle="modal" data-target="#viewCoilsModal" data-destip="${ip}" data-maptodisplay="CoilMap">
                View/Set
            </button>

        </td> 
    `
    tableBody.appendChild(p); 
}


function DisableButtonTypes()
{
    $(`button[id='${this.ip}SetHolding']`).prop("disabled",true)
    $(`button[id='${this.ip}GetHolding']`).prop("disabled",true)
    $(`button[id='${this.ip}ViewInputRegister']`).prop("disabled",true)
    $(`button[id='${this.ip}ViewDiscreteInput']`).prop("disabled",true)
    $(`button[id='${this.ip}ViewColis']`).prop("disabled",true)

}


//also poop
function EnableButtonTypes()
{
    let regmap = RegisterMap[this.type];





    let coilMapped = false;
    let InputRegisterMaped = false;
    let DiscreteInputMappeds = false;
    let HoldingMaped = false;

    
    if(regmap && regmap.CoilMap && regmap.CoilMap.length > 0)
    {
        coilMapped = true; 
    } 
    if(regmap && regmap.InputResgisterMap && regmap.InputResgisterMap.length > 0)
    {
        InputRegisterMaped =true;
    } 
    if(regmap && regmap.DiscreteInputMap && regmap.DiscreteInputMap.length > 0)
    {
        DiscreteInputMappeds = true;
    } 
    if(regmap && regmap.HoldingResiterMap && regmap.HoldingResiterMap.length > 0)
    {
        HoldingMaped= true;
    } 

    $(`button[id='${this.ip}SetHolding']`).prop("disabled",!HoldingMaped)
    $(`button[id='${this.ip}GetHolding']`).prop("disabled",!HoldingMaped)
    $(`button[id='${this.ip}ViewInputRegister']`).prop("disabled",!InputRegisterMaped)
    $(`button[id='${this.ip}ViewDiscreteInput']`).prop("disabled",!DiscreteInputMappeds)
    $(`button[id='${this.ip}ViewColis']`).prop("disabled",!coilMapped)


}



function GetFirmware()
{
    console.log("GetFirmWare")

    // let type = this.type;
    // let registerMapForThisType = RegisterMap[this.type];
    // debugger;


    let firmwareIndex = RegisterMap[this.type].InputResgisterMap.findIndex(function(name){return name == "Firmware"});
    this.firmwareIndex = firmwareIndex;
        

    //let Obj.modBus = Obj.modBus;
    this.modBus.readInputRegisters(this.firmwareIndex, 1)
    .then((data)=>{
        this.ReadDataErrorCount = 0;
        console.log(data.data);
        UpdateConnected.call(this,true);
        
        let idFirmware = this.ip + "Firmware";
        let firmwareContainer = document.getElementById(idFirmware);
        let firmWareVersionMajor = data.data[0] >> 8;
        let firmWareVersionMinor = (data.data[0] & 0xff) /10;
        let firmwareTotal = firmWareVersionMajor + firmWareVersionMinor;

        firmwareContainer.innerHTML = `<p style='color: green;'>${firmwareTotal}</p>`;   
        setTimeout(()=>{
            //shitty way but only want one but will settle for 2 get firmware running at a time
            if(this.ReadFirmwareCount && this.ReadFirmwareCount > 2)
            {
                debugger
                this.ReadFirmwareCount = this.ReadFirmwareCount -1;
            } else
                GetFirmware.call(this)
        },1000 + getRandomInt(0,50)) 
    }).catch(
        
       (reason) => {

            
            if(typeof(this.ReadDataErrorCount) != 'undefined' && typeof(this.ReadDataErrorCount) != null)
            {
                this.ReadDataErrorCount = this.ReadDataErrorCount + 1;  
            } else{
                this.ReadDataErrorCount = 1;

            }
            console.log("Get firmware Error Count" + this.ReadDataErrorCount )
            if(this.ReadDataErrorCount >= 3)
            {
                console.log('Handle rejected promise ('+reason+') here.');
                console.log(reason);
                this.ReadFirmwareCount = this.ReadFirmwareCount -1;
                setTimeout(()=>{ConnectedModbus.call(this)},1500 + getRandomInt(0,25)) 
                UpdateConnected.call(this,false);
            }
            else
            {

                    GetFirmware.call(this)
            }

                
            
    });;
}


function GetType()
{
    console.log("GetType")
    return new Promise((resolve,reject)=>{
        //bragaining that if it's not on a version version with a type it's reading random memory and 10 seqential memmory adrress are either all zero or different
        this.modBus.readInputRegisters(TypeRegisters, 10)
        .then((data)=>{
            this.ReadDataErrorCount = 0;
            console.log(data.data);
            let hasType = true;
            for (let index = 0; index < data.data.length -1 ; index++) 
            {
                if(data.data[0] != data.data[1])
                {
                    hasType = false;
                    break;
                }
                
            }
            
            if(hasType)
                resolve(data.data[0])
            else
                reslove(0);
        }).catch(
            
        (reason) => {
                
                if(typeof(this.ReadDataErrorCount) != 'undefined' && typeof(this.ReadDataErrorCount) != null)
                {
                    this.ReadDataErrorCount = this.ReadDataErrorCount + 1;  
                } else{
                    this.ReadDataErrorCount = 1;

                }
                console.log("Type read failed kak hard");
                reject(reason);

                
        });;


    })

}


function handleUnkownType()
{
    DisableButtonTypes.call(this)
    let idTypeId= this.ip + "Type";
    let typeContainer = document.getElementById(idTypeId);


    let selectOptions = "<option selected disabled>Unkown</option>";
    for(let val of  this.PossibleTypes)
    {
        selectOptions += `<option>${val}</option>`
    }
    //
    typeContainer.innerHTML = `<p style='color: red ;' id='${this.ip}dowewaveatype'>Card not reporting Type</p>
    <label for="${this.ip}TypeSelect">Select Type</label>
    <select class="form-control" id="${this.ip}TypeSelect">
        ${selectOptions}
    </select>
                                `;  

    
    //time out as it's not yet in the dom
    setTimeout(()=>{  
        document.getElementById(`${this.ip}TypeSelect`).focus(); 
 
        // jquery selector might look weird, used cause there is a "." in id "
        $(`select[id='${this.ip}TypeSelect']`).on('change', (e)=>{
        
            let ip = this.ip;


             $(`p[id='${this.ip}dowewaveatype']`).css('color', 'Green');
             $(`p[id='${this.ip}dowewaveatype']`).text("Type Selected");
  


            //have to find again cause we are not rebinding this
            let typeSelected =  $(`select[id='${this.ip}TypeSelect']`).find("option:selected").val();
            console.log("typeSelected : " + typeSelected)

            
            this.type = typeSelected;
            EnableButtonTypes.call(this);

            //very shitty way to do this- but the intention is to stop all the other get firmware calls if type changes
            if(typeof(this.ReadFirmwareCount) != 'undefined' && typeof(this.ReadFirmwareCount) != null)
            {
                this.ReadFirmwareCount = this.ReadFirmwareCount + 1;
            }
            else
            {
                this.ReadFirmwareCount = 1;
            }

            GetFirmware.call(this);

        });},1)


}



function OnModbussConected(messae)
{

    console.log("Onmodbus connected");
    GetType.call(this).then((type)=>
    {
        if(type >= CardTypemap.length )
        {
            console.log("Unkown type read");
            console.log("Unkown type read");
            console.log("Unkown type read");
            console.log(type);
            
            type= 0;
            handleUnkownType.call(this);
        } else{
            let idTypeId= this.ip + "Type";
            let typeContainer = document.getElementById(idTypeId);
            console.log("Got type " + CardTypemap[type])
            this.type = CardTypemap[type];
            //if we previously had a unkown type we might have an event listener on a dom object that doesn't exist anymore
            typeContainer.innerHTML = this.type;
            EnableButtonTypes.call(this);

            if(typeof(this.ReadFirmwareCount) != 'undefined' && typeof(this.ReadFirmwareCount) != null)
            {
                this.ReadFirmwareCount = this.ReadFirmwareCount + 1;
            }
            else
            {
                this.ReadFirmwareCount = 1;
            }

            GetFirmware.call(this);
        }

    }).catch((reason)=>
    {
        debugger;
        console.log("card read type error");
        if(this.ReadDataErrorCount >= 3)
        {
            OnModbussDisconnected.call(this); 
            
        }
        else
        {
            OnModbussConected.call(this);
        }
    })
}

function OnModbussDisconnected()
{

    this.modBus.close();
    //the joy of having a garbage collector, had some issues if port was disconnected for to long it wont reconnect, doing this seems to help- little bit heavy handed probably an error in the firmware
    this.modBus = new ModbusRTU();
    console.log("connection Error Reconecting")
    UpdateConnected.call(this,false);

    setTimeout(()=>{ConnectedModbus.call(this)},1500 + getRandomInt(0,100)) 
}

function ConnectedModbus()
{

        console.log("COnnecting " + this.ip);
        
        //let Obj.modBus = Obj.modBus;
        let ip = this.ip;
        console.log(this.modBus.connected)
        if( this.modBus.connected)
            this.modBus.close();

        setTimeout(()=>{
            this.modBus.connectTCP(this.ip, { port: 502 })
            .then(()=>{
                setConProperties.call(this)
                console.log("Connected");
                UpdateConnected.call(this,true);
                OnModbussConected.call(this);
            })
            .catch((e)=> {

                OnModbussDisconnected.call(this,e.message)
            });

        },100); 

   
}

function setConProperties() {
    
    let id = parseInt(this.ip.substring(this.ip.length -3));
    console.log("set con prop  ");
    console.log(id);
    this.modBus.setID(id);
    this.modBus.setTimeout(2500);


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
        DisableButtonTypes.call(this);
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
        $('.ConnectionLostNotifier').css('display','none');
        this.ReadHoldingError = 0;
        console.log(data.data);
        for(let val in data.data)
        {
            let id ="HoldingReg" +val;
            document.getElementById(id).innerHTML = data.data[val]
        }
    }).catch(
        
       (reason) => {

                    
        if(typeof(this.ReadHoldingError) != 'undefined' && typeof(this.ReadHoldingError) != null)
        {
            this.ReadHoldingError = this.ReadHoldingError + 1;  
        } else{
            this.ReadHoldingError = 1;

        }
        if(this.ReadHoldingError > 3)
        {
            $('.ConnectionLostNotifier').css('display','block');
        }
            
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
        this.ReadInputError = 0;
        $('.ConnectionLostNotifier').css('display','none');

    }).catch(
        
       (reason) => {
            
                    
        if(typeof(this.ReadInputError) != 'undefined' && typeof(this.ReadInputError) != null)
        {
            this.ReadInputError = this.ReadInputError + 1;  
        } else{
            this.ReadInputError = 1;

        }
        if(this.ReadInputError > 3)
        {
            $('.ConnectionLostNotifier').css('display','block');
        }

            
    });;

}

function ReadDiscreteInput()
{
    console.log("read Discrete Input")

    //let Obj.modBus = Obj.modBus;
    //readDiscreteInputs(dataAddress: number, length: number): Promise<ReadCoilResult>;
    this.modBus.readDiscreteInputs(0, this.InputRegister.length)
    .then((data)=>{
        
        console.log(data.data);
        for(let val in data.data)
        {
            let id ="InputReg" +val;
            document.getElementById(id).innerHTML = data.data[val]
        }
        this.ReadDisInputError =0;
        $('.ConnectionLostNotifier').css('display','none');

    }).catch(
        
       (reason) => 
       {
                                
            if(typeof(this.ReadDisInputError) != 'undefined' && typeof(this.ReadDisInputError) != null)
            {
                this.ReadDisInputError = this.ReadDisInputError + 1;  
            } else{
                this.ReadDisInputError = 1;

            }
            if(this.ReadDisInputError > 3)
            {
                $('.ConnectionLostNotifier').css('display','block');
            }
                console.log('Handle rejected promise ('+reason+') here.');
                console.log(reason);

            
    });;

}




function ReadCoils()
{
    console.log("read coil Input")

    //let Obj.modBus = Obj.modBus;
    //readDiscreteInputs(dataAddress: number, length: number): Promise<ReadCoilResult>;
    this.modBus.readCoils(0, this.InputRegister.length)
    .then((data)=>{
        
        console.log(data.data);
        for(let val in data.data)
        {
            let id ="#Coil" +val;
            if(data.data[val])
                $( id ).removeClass( "dotNotActive" ).addClass( "dotActive" )
            else
                $( id ).removeClass( "dotActive" ).addClass( "dotNotActive" )

        }
        $('.ConnectionLostNotifier').css('display','none');

    }).catch(
        
       (reason) => {
            
        if(typeof(this.ReadCoilError) != 'undefined' && typeof(this.ReadCoilError) != null)
        {
            this.ReadCoilError = this.ReadCoilError + 1;  
        } else{
            this.ReadCoilError = 1;

        }
        if(this.ReadCoilError > 3)
        {
            $('.ConnectionLostNotifier').css('display','block');
        }


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
    }else
    {
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
        // let firmwareIndex = RegisterMap[obj.type].InputResgisterMap.findIndex(function(name){return name == "Firmware"});
        // obj.firmwareIndex = firmwareIndex;
        
        AddToTableFunc.call(obj,container)
        ConnectedModbus.call(obj);
        pingList.push(obj.ip)
    }


    setInterval(()=>{PinallCards(pingList)},2000);

});



  $('#setHoldingRegister').on('show.bs.modal', function (event){
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
    $("#sendData").off();
    $("#sendData").click(
        function(event) 
        {
            event.preventDefault();
            var found = KnownLfCardList.find(function(element) 
            {
                return element.ip == recipient;
            });
            let RegisterValues = [];
            for(let val of RegisterMap[found.type].HoldingResiterMap)
            {
                
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
$('#viewHoldingRegister').on('show.bs.modal', function (event){
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

    //also poop
    tableBody.innerHTML = "<h1 class='ConnectionLostNotifier' style='color:red; display:none '>Connection Lost</h1>";
    let registerNames = RegisterMap[type].HoldingResiterMap;
    found.InputRegister = registerNames;
    

    
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

    let inputRegisterTarget = button.data('maptodisplay');

    console.log(inputRegisterTarget);
    console.log(inputRegisterTarget);
    console.log(inputRegisterTarget);
    console.log(inputRegisterTarget);

    let tableBody = document.getElementById("InputRegisterTableBody");
    tableBody.innerHTML = "<h1 class='ConnectionLostNotifier' style='color:red; display:none'>Connection Lost</h1>";
        
    var found = KnownLfCardList.find(function(element) {
        return element.ip == recipient;
    });
    if(!found)
        alert("Some how sending data to a unkown card please restart");
    else
    {
        let type = found.type;

        
        let registerNames = RegisterMap[type][inputRegisterTarget];
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


        //poop refactor
        if(inputRegisterTarget == "InputResgisterMap")
            MoveThisSomeHowIntoTheObject = setInterval(function(){ReadInputRegisters.call(found)},1000);
        if(inputRegisterTarget == "DiscreteInputMap")
            MoveThisSomeHowIntoTheObject = setInterval(function(){ReadDiscreteInput.call(found)},1000);
        if(inputRegisterTarget == "CoilMap")
            MoveThisSomeHowIntoTheObject = setInterval(function(){ReadDiscreteInput.call(found)},1000);    

        

    }



  })


  let MoveThisSomeHowIntoTheObject3;
  $('#viewCoilsModal').on('show.bs.modal', function (event){
      var button = $(event.relatedTarget) // Button that triggered the modal
      var recipient = button.data('destip') // Extract info from data-* attributes

      var modal = $(this)
      modal.find('.modal-title').text('Viewing Coils ' + recipient)
      //modal.find('.modal-body input').val(recipient)
      var found = KnownLfCardList.find(function(element) {
          return element.ip == recipient;
      });
      if(!found)
          alert("Some how viewing data to a unkown card please restart");
      
      let type = found.type;
  
      let tableBody = document.getElementById("CoilTableBody");
      tableBody.innerHTML = "<h1 class='ConnectionLostNotifier' style='color:red; display:none'>Connection Lost</h1>";
      let registerNames = RegisterMap[type].CoilMap;
      found.InputRegister = registerNames;
      
  
      
      for(let valName in registerNames)
      {
          let p = document.createElement("tr");
          p.innerHTML = `
          <td> ${valName} </td>
          <td> ${registerNames[valName]} </td>
          <td> <span class="dotNotActive" id="Coil${valName}"></span> </td>
          <td> <button onclick="SetCoil('${recipient}',${valName},true)">On</button> <button onclick="SetCoil('${recipient}',${valName},false)">Off</button> <button onclick="ToggleCoil('${recipient}',${valName})">Toggle</button> </td>
          `
          tableBody.append(p)
      }
  
        MoveThisSomeHowIntoTheObject3 = setInterval(function(){ReadCoils.call(found)},1000);
  
  
    })

  function SetCoil(ip,coliNum,val)
  {
    var found = KnownLfCardList.find(function(element) {
        return element.ip == ip;
    });
    if(!found)
        alert("Some how viewing data to a unkown card please restart");
    else
    {
        
        found.modBus.writeCoil(coliNum,val)
    }
    
    
    
        console.log(`ip Of Set coil ${ip} coliNum ${coliNum} val ${val}`)
      console.log(`ip Of Set coil ${ip} coliNum ${coliNum} val ${val}`)
      console.log(`ip Of Set coil ${ip} coliNum ${coliNum} val ${val}`)
      console.log(`ip Of Set coil ${ip} coliNum ${coliNum} val ${val}`)
  }

  function ToggleCoil(ip,coilNum)
  {
    var found = KnownLfCardList.find(function(element) {
        return element.ip == ip;
    });
    if(!found)
        alert("Some how viewing data to a unkown card please restart");
    else
    {
        //coil reading works per byte, 8 coils per byte and I am lazy thus reading zero to the one I want 









        found.modBus.readCoils(0,coilNum+1).then((data)=>
        {
            
            if(data.data[coilNum])
                SetCoil(ip,coilNum,false)
            else
                SetCoil(ip,coilNum,true)
        })
    }
    
    

  }

  $('#viewInputRegisterModal').on('hide.bs.modal', function (event) {

    clearInterval(MoveThisSomeHowIntoTheObject);
  })

  
  $('#viewHoldingRegister').on('hide.bs.modal', function (event) {

    clearInterval(MoveThisSomeHowIntoTheObject2);
  })

  $('#viewCoilsModal').on('hide.bs.modal', function (event) {

    clearInterval(MoveThisSomeHowIntoTheObject3);
  })

