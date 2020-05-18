//Detecta theme 
function detectaTheme(){
    const sesion = parseInt(sessionStorage.getItem("theme"));
    if(sesion === 1){
        cambiarDay()
    }if(sesion===2){
        cambiarNigth();
    }
}
//Conexion Api sugerencias
async function llamadaSugerencia(){
    const keyApi = 'yHSnTgfcpsaHckESxsZsSIuXbP3uulnd';
    const consulta = await fetch('http://api.giphy.com/v1/gifs/random?q='+'&api_key='+keyApi);
    const data = await consulta.json();
    
    return data;
}

//Modifica DOM suguerencias
async function modificaHoy(){
    detectaTheme()
    const imgHoy = document.getElementsByClassName("img");
    const tittleSugerencias = document.querySelectorAll(".video .head-video p");
    console.log(tittleSugerencias);
    for(let i = 0 ; i < imgHoy.length ; i++){
        const objetoApi = await llamadaSugerencia();
       
        imgHoy[i].setAttribute("src", objetoApi.data.images.downsized.url);

        //Guatda el title del Gif para mostrarlo en el div-head de la img
        var hashtag = objetoApi.data.title;
        tittleSugerencias[i].innerHTML =  "#" + hashtag.substr(0,20);

    }
    //Muestra las tendencia al cargar el html
    await modificaTendencia();

}
 
//Conexion Api tendencias
async function llamadaTendencia(){
    const keyApi = 'yHSnTgfcpsaHckESxsZsSIuXbP3uulnd';
    const consulta = await fetch('http://api.giphy.com/v1/gifs/trending?q='+'&api_key='+keyApi);
    const data = await consulta.json();
    
    return data;
}

//modificar DOM tendencias
async function modificaTendencia(){
    const div = document.getElementById("container-tendencias");
    const arrayTendencia = await llamadaTendencia();
    console.log(arrayTendencia)
    for(let i = 0; i < 20; i++){
        
        //Crea dinamicamente las img y el bot de las tendencias y los resultados de busqueda
        const divTotal = document.createElement("div")
        const imgGif = document.createElement("img");
        const divBot = document.createElement("div");
        divBot.innerHTML= "#" + arrayTendencia.data[i].username;
        divBot.classList.add("botImg");
        imgGif.style.height  = "298px";
        if(i % 4 ==0){
            imgGif.style.width  = "592px";
        }else{
            imgGif.style.width  = "288px";
        }
        imgGif.setAttribute("src", arrayTendencia.data[i].images.downsized.url);
        divTotal.appendChild(imgGif);
        divTotal.appendChild(divBot);
        divTotal.classList.add("hover")
        //Añade el div con la img y el bot al div principal del la section
        div.appendChild(divTotal);
       
    }
   //Manupula el hover de las img para mostrar el borde y el bot
   const arrayDiv = document.getElementsByClassName("hover")
   console.log(arrayDiv)
   hover(arrayDiv);
}

//Conexion Api Search
async function llamadaSearch(){
    const keyApi = 'yHSnTgfcpsaHckESxsZsSIuXbP3uulnd';
    const inputS = document.getElementById("inputS").value;
    const consulta = await fetch('http://api.giphy.com/v1/gifs/search?q='+inputS+'&api_key='+keyApi);
    const data = await consulta.json();
    
    return data;
}

//Modifica DOM BUSQUEDA
async function modificaSearch(){
    //seleccion de las img del contenedor tendencias
    const containerT = document.querySelectorAll(".tendencias .container-tendencias img");
    const arraySearch = await llamadaSearch();
    
    for(let i =0; i<containerT.length; i++){
        let objImg = containerT[i];
        objImg.setAttribute("src", arraySearch.data[i].images.downsized.url )
    }
    //cambia p en la section tendencias
    const pSearc = document.getElementById("texTendencia").innerHTML ="Resultado de la busqueda"

    //oculta section hoy
    const hoy = document.getElementById("containerHoy");
    hoy.style.display="none";

    //oculta div sugerencias
    const input = document.getElementById("divSugerencia");
    input.style.display="none"
}

//Funcionalidad Boton "Ver Mas"
function verMas (id){
    //Cambia el color del boton de busqueda cuando detecta un press en le input
    const btnBuscar = document.getElementById("btnBuscar");
    btnBuscar.style.background="#F7C9F3";
    btnBuscar.style.color="#110038";

    //Selecciona el p segun su posiscion en el array que depende del id del boton
    const hashtagBusqueda = document.querySelectorAll(".video .head-video p");

    const text = hashtagBusqueda[id].innerText;
    //Borra el 1er caracter (#) y selecciona el input para insertarle el valor que corresponde
    const textFinal = text.substring(1);
    const inputS = document.getElementById("inputS")
    
    if (textFinal.length === 0) {
        inputS.value = "Random";
    } else {
        inputS.value = textFinal
    }
    modificaSearch();
}

//Funcionalidad del los Botones close de img sugerencias
async function btnClose (id, event ){
    //Traigo un gif random
    const gifCambiar = await llamadaSugerencia()

    let i = id;
    const divClose = document.getElementsByClassName("close");
    //Comparo para ver en que tag se genero el evento
    for (let index = 0; index < divClose.length; index++) {
        if(event.target === divClose[index]){
            i = index;
           
                //selecciona las img de sugerencias
                const imgCambiar = document.getElementsByClassName("img");
    
                //Cambia el src de la imagen que corresponde y el title de dicho GIF
                imgCambiar[i].setAttribute('src', gifCambiar.data.images.downsized.url)

                const tittleSugerencias = document.querySelectorAll(".video .head-video p");
                tittleSugerencias[i].innerHTML = "#"+gifCambiar.data.title.substr(0,20);
        }
        
    }
}

//Desplegar btn de elegir tema
function desplegaBtn(){
    
    const despegable = document.getElementById("oculta").style.display;

    if(despegable === "none"){
        let menu = document.getElementById("oculta");
        menu.style.display="flex";
        menu.style.position="absolute";
        menu.style.zIndex ="0";

    }else{
        let menu2 = document.getElementById("oculta");
        menu2.style.display="none"
    }
}

//Muestra div sugerencia de busqueda
function mostrarDiv(){
    const input = document.getElementById("divSugerencia");
    
    input.style.display="block"
    
}

//Cambiar tema
function cambiarDay(){
    //Guardo un valor en el sessionstorage para saber en que estado estoy
    //1=== day
    //2 === nigth
    sessionStorage.setItem("theme", 1);

      //cambia color body
      const body = document.body;
      body.style.backgroundColor="#FFFFFF";
  
      //cambia img logo
      const logo = document.getElementById("logo");
      logo.setAttribute("src" , "recursos/gifOF_logo.png");
  
      //cambia color de fuente btn
      const firt = document.getElementById("a").style.color="#110038"
      const fuente =document.getElementsByClassName("nigth");
      //Cambia color de barra divisioria del btn
        const barra = document.querySelector(".div-lst .btn .barra")
        barra.style.borderColor= "#110038";
      
      for(i=0; i<fuente.length; i++){
          fuente[i].style.color="#110038"
      }
  
      //cambiar color de btn
      const btn = document.getElementsByClassName("btn");
      for (let i = 0; i < btn.length; i++) {
          btn[i].style.backgroundColor ="#F7C9F3";
      }
      const divOculta = document.getElementById('oculta');
      divOculta.style.display="none"

}
function cambiarNigth(){
    //Guardo un valor en el sessionstorage para saber en que estado estoy
    //1=== day
    //2 === nigth
    sessionStorage.setItem("theme", 2)

    //cambia color body
    const body = document.body;
    body.style.backgroundColor="#290654";



    //cambia img logo
    const logo = document.getElementById("logo");
    logo.setAttribute("src" , "recursos/gifOF_logo_dark.png");

    //Cambia color de barra divisioria del btn
    const barra = document.querySelector(".div-lst .btn .barra")
    barra.style.borderColor="#FFFFFF";

    //cambia color de fuente btn
    const firt = document.getElementById("a").style.color="#FFFF"
    const fuente =document.getElementsByClassName("nigth");
    for(i=0; i<fuente.length; i++){
        fuente[i].style.color="#FFFFFF"
    }

    //cambiar color de btn
    const btn = document.getElementsByClassName("btn");
    for (let i = 0; i < btn.length; i++) {
        btn[i].style.backgroundColor ="#EE3EFE";  
    }
    const img  = document.getElementById('drop');
    img.setAttribute("src", "recursos/dropdown.svg")
    
    const divOculta = document.getElementById('oculta');
    divOculta.style.display="none"
    
}

//Conexion api con endpoint de Autocomplete search
async function llamadaSugerenciaBusqueda(inputs){
    const keyApi = 'yHSnTgfcpsaHckESxsZsSIuXbP3uulnd';
    const inputS = inputs;
    const consulta = await fetch('http://api.giphy.com/v1/gifs/search/tags?q='+inputS+'&api_key='+keyApi);
    const data = await consulta.json();

    return data;
}

//Muestra el div con las sugerencias de busqueda y y detecta cuando se ingresa un valor en el input
async function modificaAutocomplete(){
    //Cambia el color del boton de busqueda cuando detecta un press en le input
    const btnBuscar = document.getElementById("btnBuscar");
    btnBuscar.style.background="#F7C9F3";
    btnBuscar.style.color="#110038"
    //TOMA el valor del input de busqueda y le resta el primer que valor de la cadena que se encuentra vacia
    const inputS = document.getElementById("inputS").value;
    inputS.substr(1);

    const divSugerencia = document.getElementById("divSugerencia");
    var valor;
    
    
    //Detecta cuando el usuario ingreso 3 terminos en el input y muestra el div y toma el valo para mandarlo en la funcion correspondiente
    if(inputS.length === 3){
        divSugerencia.style.display="flex";
        valor = inputS;
        console.log("valor", valor)
        await muestraTermBusquedsda(valor);
    }
    if(inputS.length ===2){
        divSugerencia.style.display="none";
    }
}

//Funcion apra ejecutar la busqueda cuando se elige unos de los terminos recomendados
function seleccionTerm(event){
    //Identifica el elemento p que se esta buscando y lo aplica como valor del input y ejecuta la busqueda
   
    const terminosDeBusqueda = event.target
    const element = terminosDeBusqueda.innerText;
    const inputS = document.getElementById("inputS");
    inputS.value = element;

    modificaSearch();
}

//Funcio que toma el valor que se ingreso en el input y realiza la llamada correspondiente
async function muestraTermBusquedsda(valor){
    const value = valor;
    const data = await llamadaSugerenciaBusqueda(value);

    //Selecciona lo p para reemplazar su valor por el que nos devuelve la api
    const arregloTagP = document.getElementsByClassName("result");
   
    for (let index = 0; index < arregloTagP.length; index++) {
        const elementoP = arregloTagP[index];
        const textoP = data.data[index].name;
        console.log("texto",textoP)
        elementoP.innerHTML = textoP;   
    }
}




//Funcion hover para las img
function hover (array){
    const elementos = array;
    //selecciona el div bot de la img para mostrarlo
    const divBot = document.getElementsByClassName("botImg");

    for (let index = 0; index < elementos.length; index++) {
        const element = elementos[index];
        element.addEventListener("mouseover", function(){
            divBot[index].style.display= "block"
        })
        element.addEventListener("mouseout", function(){
            divBot[index].style.display= "none"
        })
    }
}