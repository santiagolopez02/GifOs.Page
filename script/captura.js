
/*Comenzar la creacion de gif*/

//Algunas variables utilizadas
const video = document.querySelector('video');
var recorder;
const apiKey = "yHSnTgfcpsaHckESxsZsSIuXbP3uulnd";
const img = document.getElementById("video2");

function comenzarCaptura(){
    //Muestra y oculta obejtos correspondiente
    const divCrear = document.getElementById('crear');
    divCrear.classList.add('none');

    const divCapura = document.getElementById("captura");
    divCapura.classList.remove('none')


    //Inicia el uso de la cam con libreria RecordRTC

     navigator.mediaDevices.getUserMedia({
         
         audio: false,
 
         video: {
             width:{max:1280},
             height: { max: 480 }
             }
     }).then(stream =>{
         video.srcObject = stream;
         video.play()
     }).catch(console.error)

}


function comenzarGrabar(){
    /*mostrar y ocultar lo que corresponde*/
    const divBtn = document.getElementById("btn-captura");
    divBtn.classList.add('none');

    const divCronometro = document.getElementById('btn-cronometro');
    divCronometro.classList.remove('none');

    //Inicia cronometro
    empezar();

    capturaCamara(function (camera) {
        video.muted = true;
        video.volume = 0;
        video.srcObject = camera;
        console.log("estoy aca")
        
        recorder = RecordRTC(camera, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 1280,
            hidden: 240,
            
            onGifRecordingStarted: function () {
                console.log('started')
            },
        });
        recorder.startRecording();
        recorder.camera = camera;
        
        
        //Muestra tiempo del video
        video.ontimeupdate = function () {
        var p =  document.getElementsByClassName('timer')
        
        for (let index = 0; index < p.length; index++) {
            const element = p[index];

            element.innerHTML = videoTime();   
        }
        };

    });
}


//Funcion para capturar y grabar
const parametros = { 
    audio: true,
    video: { width: 1280, height: 720 } 
}

function capturaCamara(callback) {
    navigator.mediaDevices.getUserMedia(parametros)
    .then(function (camera) {
        video.srcObject = camera;
        video.onloadedmetadata = function (e) {
            video.play();
        };
        callback(camera);
        
    })
    .catch(function (err) { 
        console.log(err.name + ": " + err.message);
    });
}

//Funcion detener el recording

function detenerRecording(){
    //oculta y muestra lo correspondiente
    const divCap = document.getElementById("captura");
    divCap.classList.add('none');

    const divSubir = document.getElementById("subir");
    divSubir.classList.remove('none')

    recorder.stopRecording(stopRecordingCallback);
    
}

function stopRecordingCallback() {
    
    let blob = recorder.getBlob();
    console.log("estes es ", blob);

    const url = URL.createObjectURL(blob);
    img.style.display="block"
    img.setAttribute('src', url);
    recorder.camera.stop();
}

//Funcionamiento timer
//Crear un cronometro para iniciar la captura
var emp;
var cronometro;
var actual;
var cro;
var cr;
var cs;
var sg;
var vamn;
var ho;
var mn;
function empezar() {
     emp =new Date(); 
     cronometro=setInterval(tiempo,10);
    
    }

function tiempo() { 
     actual=new Date();	
        //tiempo del crono (cro) = fecha instante (actual) - fecha inicial (emp)	
    cro=actual-emp; //milisegundos transcurridos.	
    cr=new Date(); //pasamos el num. de milisegundos a objeto fecha.	
    cr.setTime(cro); 
        //obtener los distintos formatos de la fecha:	
    cs=cr.getMilliseconds(); //milisegundos 	
     cs=cs/10; //paso a centésimas de segundo.	
     cs=Math.round(cs); //redondear las centésimas	
    sg=cr.getSeconds(); //segundos 	
    vamn=cr.getMinutes(); //minutos 	
    ho=cr.getHours()-1; //horas 	
        //poner siempre 2 cifras en los números			 
     if (cs<10) {cs="0"+cs;} 
     if (sg<10) {sg="0"+sg;} 
     if (mn<10) {mn="0"+mn;} 
        //llevar resultado al visor.
    const visor = document.getElementById('timer')   			 
     visor.innerHTML="00"+":"+sg+":"+cs; 
     }

//Crea formato para mostrar el tiempo del video
function agregaFormato(n) {
    return (n < 10 ? '0' : '') + n;
}

//Capta el tiempo del video
function videoTime() {
   
    time = video.currentTime;
    if (time > 60)
    time = time % 60;
    time = time.toFixed(2);
    
    var s = video.currentTime * 1000;
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    
    return (agregaFormato(hrs) + ":" + agregaFormato(mins) + ":" + agregaFormato(time));
}

//Enviar Gifo

//Var para cancelar EnviarGif()
const controller = new AbortController()
const signal = controller.signal

function EnviarGif() {
//Muestra y oculta lo que corresponde
    const divSubir = document.getElementById("subir");
    divSubir.classList.add('none');

    const progress = document.getElementById("progress");
    progress.classList.remove('none')

    var numeroRandom = "mygif" + localStorage.length;
    try {
        form = new FormData();
        form.append('file', recorder.getBlob(), numeroRandom + '.gif');
        console.log(form.get('file'));
        
        recorder.destroy();
        recorder = null;
        
        const load = fetch('https://upload.giphy.com/v1/gifs?&api_key=' + apiKey, {
        method: 'POST',
        signal: signal,
        body: form
    })
    .then((response) => response.json()
    )
    .then((result) => {
        console.log('Resultado:', result);
        var data = { type: "gif", id: result.data.id }
        localStorage.setItem(numeroRandom, JSON.stringify(data));
        exitoCarga(numeroRandom);
       
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
catch (e) {
    console.log("Uploard Error: " + e);
};

progresBar();
}

//Progres Bar
function progresBar() {
    var elem = document.getElementById("barra");   
    var width = 1;
    var id = setInterval(frame, 30);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
}

//Abort fetch
function abortFetching() {
    console.log('Fetch de carga abortado');
    // Abortar
    controller.abort()
    //recarga el dom 
    location.reload();
} 

//Repetir captura
function repeatCaptura(){
    window.location.reload(); 
}

//Cargar Exito

function exitoCarga(key){
    setTimeout(function(){
        const divProgres = document.getElementById("progress")
        divProgres.classList.add('none');
    
        const divExito = document.getElementById('exito');
        divExito.classList.remove('none');
    },1000)

    
    var store = localStorage.getItem(key);
    console.log(store)
    if (store !== null) {
        store = JSON.parse(store);
        console.log(store)
        var gifID = "&ids=" + store.id;
        
        var url = "https://api.giphy.com/v1/gifs?&api_key=" + apiKey + gifID;
        fetchGifo(url).then(data => {
            const video3 = document.getElementById("video3");
            video3.setAttribute('src' , data.data[0].images.original.url)

            //Lo muestro en la section mis gifos
            const divMisGifos= document.getElementById("misGifos")
            const imgMia = document.createElement('img');
            imgMia.classList.add('img-mia')
            imgMia.setAttribute('src', data.data[0].images.original.url)
            divMisGifos.appendChild(imgMia);
            
        })
        .catch((err) => {
            console.log("este erro" , err)
        });
    }
    else {
        console.log("este erro")
    }
}

//Fecth para traer los gif
function fetchGifo(url) {
    const found = fetch(url)
    .then(response => {
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.log(error)
        return error;
    });
    return found;
}

//Funcionalidad btn listo
function btnListo(){
    location.reload();
}

//Muestra todos los Gifos creados
function muestraCreados(){
    detectaTheme()
    const divMisGifos= document.getElementById("misGifos")
    for (let i = 0; i < localStorage.length; i++) {
        var storage = localStorage.getItem('mygif' + i);
        if (storage !== null) {
            storage = JSON.parse(storage);
            var gifID = "&ids=" + storage.id;
            var url = "https://api.giphy.com/v1/gifs?&api_key=" + apiKey + gifID;
            fetchGifo(url).then(data => {

                //Crea img para mostrar
                const imgMia = document.createElement('img');
                imgMia.classList.add('img-mia')
                imgMia.setAttribute('src', data.data[0].images.original.url)
                divMisGifos.appendChild(imgMia);

            })
            .catch((err) => {
                console.log("estes es el error", err)
            });
        }
        else {
            console.log("Sucedio un error")
        }
    }
}

//Copiar url
function copyUrl() {
    
    // Crea un campo de texto 
    var campo = document.createElement("input");
    
    // Asigna el contenido del elemento especificado al valor del campo
    campo.setAttribute("value", document.getElementById('video3').src);
    
    // Añade el campo a la página
    document.body.appendChild(campo);
    
    // Selecciona el contenido del campo
    campo.select();
    
    // Copia el texto seleccionado
    document.execCommand("copy");
    
    // Elimina el campo de la página
    document.body.removeChild(campo);
}

//Descargar gif creado
function descargarGif(){
    const gifCreado = document.getElementById('video3').src;

    var a = document.createElement('a');
    a.href= gifCreado;
    a.download = true;
    a.target = '_blank';
    
    a.click()
}

//Funcion theme
function detectaTheme(){
    const store = sessionStorage.getItem("theme");
    var session = parseInt(store)
    if(session === 2){
        muestraNigth();
    }

}
function muestraNigth(){
    //cambia el color de fondo 
     //cambia color body
     const body = document.body;
     body.style.backgroundColor="#290654";

    //cambia img logo
    const logo = document.getElementById("logoCaptura");
    logo.setAttribute("src" , "recursos/gifOF_logo_dark.png");

    //Cambia el color de btn capturar
    const btn = document.getElementById("capturar");
    btn.style.background="#EE3EFE";
    btn.style.color="#FFFFFF";
    //cambia la img del btn captura
    const img = document.getElementById("camara");
    img.setAttribute("src", "recursos/camera_light.svg")

    //cambia colo btn listo
    const btnL = document.getElementById("btnL")
    btnL.style.background="#FF6161";
    btnL.style.color="#FFFFFF";

    //cambia estilo btn repetir
    const repetir = document.getElementById("repetir");
    repetir.style.background="#290654";
    repetir.style.color="#FFFFFF";

    //cambia estilo btn subir gif
    const subir = document.getElementById("btnSubir");
    subir.style.background="#EE3EFE";
    subir.style.color="#FFFFFF";
}