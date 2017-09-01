//Inicializamos variables
var programa, memoria, opcode1, opcode2, address1, address2, left = true, base="hex", next=true;
//Registros
var aC=0, pC=0, mQ=0;

//Para cambiar el tipo de dato ingresado
$(document).ready(function() {
  $("input[name=num]").on("change", function() {

    $("input:checked").each(function(key, val) {
      cambiarNum($(val).val());
    });
  });
});

//Cambiamos la base
function cambiarNum(num)
{
    display = document.querySelector('#programa');
    if(num=="bin"){
        base ="bin";
    }
    if(num=="dec"){
        base ="dec";
    }
    if(num=="hex"){
        base ="hex";
    }
    refreshPrg();
    showReg();
}


//Este sirve para interpretar los números de acuerdo a la base
function interpretarNum(num)
{
    var faltante;
    if(num!=null && num >= -549755813888 && num<= 549755813887)
    {
        if (base=="dec") return num;
        if(num>=0){
            if (base=="hex") {
                if(num.toString(16).length==10)
                return num.toString(16);
                else
                {
                    faltante=10-num.toString(16).length;
                    return "0".repeat(faltante) +num.toString(16);
                }
            }
            if (base=="bin") {
                if(num.toString(2).length==40)
                    return num.toString(2);
                else
                {
                    faltante=40-num.toString(2).length;
                    return "0".repeat(faltante) +num.toString(2);
                }
            }
        }
        else
        {
            if (base=="hex") {
                if((num >>> 0).toString(16).length==10)
                return (num >>> 0).toString(16);
                else
                {
                    faltante=10-(num >>> 0).toString(16).length;
                    return "f".repeat(faltante) +(num >>> 0).toString(16);
                }
            }
            if (base=="bin") {
                if((num >>> 0).toString(2).length==40)
                    return (num >>> 0).toString(2);
                else
                {
                    faltante=40-(num >>> 0).toString(2).length;
                    return "1".repeat(faltante) +(num >>> 0).toString(2);
                }
            }
        }
    }
    else
    {
        if(num < -549755813888 || num > 549755813887)
        {
           alert("OVERFLOW or UNDERFLOW");
            var nuevo = num.toString(16)
            nuevo = nuevo.substr(nuevo.length - 10,nuevo.length);
            num= parseInt(nuevo,16);
            interpretarNum(num);
        }
    }
        
}

//Mostrar los registros
function showReg()
{
    display= document.querySelector('#results');
    display.innerHTML="PC: "+interpretarNum(pC)+"<br>AC: "+interpretarNum(aC)+"<br>MQ: "+interpretarNum(mQ)+"<br> "
    
}

//Este sirve para ver el programa
function PreviewText() {
    var file = document.getElementById("uploadText").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
        var datos = evt.target.result;
        programa=datos.split("\n");
        display=document.querySelector('#opciones');
        display.innerHTML ="<div class='btn-group' role='toolbar' aria-label=''...''><button  type='button' class='btn btn-default' id='Previous' onclick='leerInstruccionAnterior()'><span class='glyphicon glyphicon-backward'></button><button type='button' class='btn btn-default' id='Play' onclick='leerInstrucciones()'><span class='glyphicon glyphicon-play'></span></button><button type='button' class='btn btn-default'id='Next' onclick='leerInstruccionSig()'><span class='glyphicon glyphicon-forward'></button></div>";
        refreshPrg();
        showReg();
        }
    reader.onerror = function (evt) {
        document.getElementById("estado").innerHTML = "error reading file";
    }
}
};

//Ver la memoria
jQuery.get('datos.txt', function(data) {
    memoria=data.split(",");
    memoria[memoria.length-1]="0000000000";
    for(x=memoria.length; x < 1024; x++)
    {
        memoria.push("0000000000");
    }
    refreshMem();
});

//Subir una nueva memoria
function PreviewMemory() {
    var file = document.getElementById("uploadText2").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
        var datos = evt.target.result;
        memoria =datos.split(",");
        for(x=memoria.length; x < 1000; x++)
        {
            memoria.push("0000000000");
        }
        refreshMem();
        
        }    
    reader.onerror = function (evt) {
        document.getElementById("estado").innerHTML = "error reading file";
    }
}
};

//Leer cada instrucción (de una sola botón de play)
function leerInstrucciones()
{
    //PC =0 
    pC=0;
    //Cargamos el contenido del Programa en el PC= 0
    var contenido=programa[pC];
    while(next)
    {
        //Aumentamos el PC
        pC+=1;
        //Interpretamos las instrucciones
        opcode1=contenido.substring(0,2);
        address1=contenido.substring(2,5);
        opcode2=contenido.substring(5,7);
        address2=contenido.substring(7,10);
        //Ejecutamos instrucción izquierda
        if(left==true)
        {
            left=false;
            ejecutarInstruccion(opcode1,address1);
        }
        showReg();
        refreshPrg();
        refreshMem();
        //Revisamos si la siguiente linea tiene instrucción
        if(next==false)
        {
            break;
        }
        //Ejecutamos derecha
        if(left==false)
        {
            left=true;
            ejecutarInstruccion(opcode2,address2);
        }
        showReg();
        refreshPrg();
        refreshMem();
        //Cambiamos de linea
        if(programa.legth != pC)
        {
            contenido=programa[pC];
        }
    }
    //Al finalizar devolvemos todo a sus valores iniciales
    pC=0;
    next=true;
    aC=0;
    mQ=0;
    
}

//Leer siguiente instrucción
function leerInstruccionSig()
{
    if(programa.legth != pC)
    {
        //Revisamos el contenido del PC
        contenido=programa[pC];
        //Ejecutamos la instrucción izquierda
        if(left==true){
            opcode1=contenido.substring(0,2);
            address1=contenido.substring(2,5);
            left=false;
            ejecutarInstruccion(opcode1,address1);
            showReg();
            refreshPrg();
            refreshMem();
            return;
        }
        //Ejecutamos la derecha
        if(left==false)
        {
            opcode2=contenido.substring(5,7);
            address2=contenido.substring(7,10);
            left=true;
            ejecutarInstruccion(opcode2,address2);
            pC+=1;
            showReg();
            refreshPrg();
            refreshMem();
            return;
        }
        
    }
    //Al acabar reseteamos todo
    if(next==false)
    {
        aC=0;
        pC=0;
        mQ=0;
    }
}

//Instrucción anterior
function leerInstruccionAnterior()
{
    if(programa.legth != pC && pC>=0)
    {
        if(left==true && pC>0)
        {
            pC-=1;
            contenido=programa[pC];
            opcode2=contenido.substring(5,7);
            address2=contenido.substring(7,10);
            left=false;
            ejecutarInstruccion(opcode2,address2);
            showReg();
            refreshPrg();
            refreshMem();
            return;
        }
        if(left==false)
        { 
            contenido=programa[pC];
            opcode1=contenido.substring(0,2);
            address1=contenido.substring(2,5);
            left=true;
            ejecutarInstruccion(opcode1,address1);
            showReg();
            refreshPrg();
            refreshMem();
            return;
        }
    }
    
}

//VER EL CÓDIGO
function refreshPrg()
{
    var contenido="", op, ad, op2, ad2, bol=true;
    display = document.querySelector('#programa');
    for(x=0;x<programa.length;x++)
    {
        //contenido+="<br>";
        op=programa[x].substring(0,2);
        ad=programa[x].substring(2,5);
        op2=programa[x].substring(5,7);
        ad2=programa[x].substring(7,10);
        if(interpretarInstruccion(op,ad)=="HALT" || interpretarInstruccion(op2,ad2)=="HALT")
        {
            if(x==pC){contenido+="<b>";}
            contenido+="HALT";
            if(x==pC){contenido+="</b>";}
            break;
        }
            if(bol==true)
            {
                bol=false;
                if(left==true && pC==x){
                    contenido+="<b>";
                }
                contenido+=interpretarInstruccion(op,ad);
                if(left==true && pC==x){
                    contenido+="</b>";
                }
                contenido+="<br>";
            }
            if(bol==false)
            {
                if(left==false && pC==x){
                    contenido+="<b>";
                }
                bol=true;
                contenido+=interpretarInstruccion(op2,ad2);
                if(left==false && pC==x){
                    contenido+="</b>";
                }
                contenido+="<br>";
            }
        
    }
    display.innerHTML=contenido;
}

//INTERPRETAR CÓDIGO
function interpretarInstruccion(oP,aD)
{
    aD=parseInt(aD, 16);
    
    //Arithmetic begin

    //ADD from memory to AC and store in AC
    if(oP=="05")
    {
        return "ADD "+interpretarNum(parseInt(memoria[aD],16));
    }
    //ADD absolute from memory to AC and store in AC
    if(oP=="07")
    {
        return "ADD |"+interpretarNum(parseInt(memoria[aD],16))+"|";
    }
    //SUB from memory to AC and store in AC
    if(oP=="06"){
         return "SUB "+interpretarNum(parseInt(memoria[aD],16));
    }
    //SUB absolute from memory to AC and store in AC
    if(oP=="08")
    {
       return "SUB |"+interpretarNum(parseInt(memoria[aD],16))+"|";
    }
    //MUL from memory times MQ and store in AC
    //(most significant) and MQ(least significant)
    if(oP=="0B"){
        return "MUL "+interpretarNum(parseInt(memoria[aD],16));
        
    }
    //DIV AC by memory and store in AC
    //(remainder) and MQ(quotient)
    if(oP=="0C"){
        return "DIV "+interpretarNum(parseInt(memoria[aD],16));
    }
    //LSH AC times 2 and store in AC
    //shift left one bit position
    if(oP=="14")
    {
        return "LSH AC ";
    }
    //RSH AC by 2 and store in AC
    //shift right one bit position
    if(oP=="15")
    {
        return "RSH AC ";
    }
    
    //Arithmetic end
    //Jump begin

    //JUMP to memory location left
    if(oP=="0D")
    {
        return "JUMP L["+interpretarNum(aD)+"]";
    }
    //JUMP to memory location right
    if(oP=="0E")
    {
        return "JUMP R["+interpretarNum(aD)+"]";
    }
    //JUMP if AC positive to memory location left
    if(oP=="0F"){
       return "JUMP +L["+interpretarNum(aD)+"]";
    }
    //JUMP if AC positive to memory location right
    if(oP=="10")
    {
        return "JUMP +R["+interpretarNum(aD)+"]";
    }

    //Jump end
    //Load begin

    //LOAD MQ
    if(oP=="0A")
    {
        return "LOAD MQ";
    }
    //LOAD MQ, M(x)
    if(oP=="09"){
        return "LOAD MQ, "+interpretarNum(parseInt(memoria[aD],16));
    }
    //STOR M(x)
    if(oP=="21"){
        return "STOR "+interpretarNum(aC);
    }
    //LOAD M(x)
    if(oP=="01")
    {
        return "LOAD "+interpretarNum(parseInt(memoria[aD],16));
    }
    //LOAD -M(x)
    if(oP=="02")
    {
        return "LOAD -"+interpretarNum(parseInt(memoria[aD],16));
    }
    //LOAD |M(x)|
    if(oP=="03")
    {
        return "LOAD |"+interpretarNum(parseInt(memoria[aD],16))+"|";
    }
    //LOAD -|M(x)|
    if(oP=="04")
    {
       return "LOAD -|"+interpretarNum(parseInt(memoria[aD],16))+"|";
    }
    //Load end
    //STOR begin
    //STOR end
    //HALT
    if(oP=="00" && aD==0)
    {
        return "HALT";
    }
    //END OF THE INSTRUCTIONS
}

function refreshMem()
{
    var contenido="";
    display = document.querySelector('#memoria');
    for(x=0;x<memoria.length;x++)
    {
        if(x%86==0){
            contenido+="<div class='col-md-1'>";
        }
        contenido+="D"+x+": ";
        contenido+=memoria[x];
        contenido+="<br>";
        if((x+1)%86==0)
        {
            contenido+="</div>";
        }
    }
    
    display.innerHTML=contenido;
}

function ejecutarInstruccion(oP,aD)
{
    aD=parseInt(aD, 16);
    
    //Arithmetic begin

    //ADD from memory to AC and store in AC
    if(oP=="05")
    {
        aC+=parseInt(memoria[aD],16);
    }
    //ADD absolute from memory to AC and store in AC
    if(oP=="07")
    {
        aC+=Math.abs(parseInt(memoria[aD],16));
    }
    //SUB from memory to AC and store in AC
    if(oP=="06"){
        aC-=parseInt(memoria[aD],16);
    }
    //SUB absolute from memory to AC and store in AC
    if(oP=="08")
    {
        aC-=Math.abs(parseInt(memoria[aD],16));
    }
    //MUL from memory times MQ and store in AC
    //(most significant) and MQ(least significant)
    if(oP=="0B"){
        aC=parseInt(memoria[aD],16)*mQ;
    }
    //DIV AC by memory and store in AC
    //(remainder) and MQ(quotient)
    if(oP=="0C"){
        c=aC;
        aC%=parseInt(memoria[aD],16);
        mQ=Math.floor(c/parseInt(memoria[aD],16));
    }
    //LSH AC times 2 and store in AC
    //shift left one bit position
    if(oP=="14")
    {
        aC*=2;
    }
    //RSH AC by 2 and store in AC
    //shift right one bit position
    if(oP=="15")
    {
        aC/=2;
    }
    
    //Arithmetic end
    //Jump begin

    //JUMP to memory location left
    if(oP=="0D")
    {
        pC=aD;
        left=true;
    }
    //JUMP to memory location right
    if(oP=="0E")
    {
        pC=aD;
        left=false;
    }
    //JUMP if AC positive to memory location left
    if(oP=="0F" && aC>=0){
        pC=aD;
        left=true;
    }
    //JUMP if AC positive to memory location right
    if(oP=="10" && aC>=0)
    {
        pC=aD;
        left=false;
    }

    //Jump end
    //Load begin

    //LOAD MQ
    if(oP=="0A")
    {
        aC=mQ;
    }
    //LOAD MQ, M(x)
    if(oP=="09"){
        mQ=parseInt(memoria[aD],16);
    }
    //STOR M(x)
    if(oP=="21"){
        var momentaneo= base;
        cambiarNum("hex");
        memoria[aD]=interpretarNum(aC);
        cambiarNum(momentaneo);
    }
    //LOAD M(x)
    if(oP=="01")
    {
        aC=parseInt(memoria[aD],16);
    }
    //LOAD -M(x)
    if(oP=="02")
    {
        aC=parseInt(memoria[aD],16)*(-1);
    }
    //LOAD |M(x)|
    if(oP=="03")
    {
        aC=Math.abs(parseInt(memoria[aD],16));
    }
    //LOAD -|M(x)|
    if(oP=="04")
    {
        aC=Math.abs(parseInt(memoria[aD],16))*(-1);
    }
    //Load end
    //STOR begin
    
    //STOR M(x8:19)
    if(oP=="12")
    {
        var momentaneo= base;
        cambiarNum("hex");
        memoria[aD]=memoria[aD].substring(0,2)+interpretarNum(aC).substring(7,10)+memoria[aD].substring(5,10);
        cambiarNum(momentaneo);
    }
    //STOR M(x28:39)
    if(oP=="13")
    {
        var momentaneo= base;
        cambiarNum("hex");
        memoria[aD]=memoria[aD].substring(0,7)+interpretarNum(aC).substring(7,10);
        cambiarNum(momentaneo);
    }   
    
    //STOR end
    //HALT
    if(oP=="00" && aD==0)
    {
        
        alert("HALT\nProgram execution finished, results:\n AC: "+interpretarNum(aC)+"\nMQ: "+interpretarNum(mQ));
        next=false;
        
    }
    //END OF THE INSTRUCTIONS
}



//Download memory
function download() {
    var display;
    var a = document.getElementById("a");
    var file = new Blob([memoria], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = "datos.txt";
    display= document.getElementById("a");
    display.innerHTML="<label class='btn btn-default btn-file' ><span class='glyphicon glyphicon-download-alt' aria-hidden='true'></span> Descargar memoria</label>";
}