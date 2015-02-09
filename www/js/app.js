$( "#listaMusica" ).trigger( "updatelayout" );
// Definimos variables globales
var fs = null; // Variable de fileSystem
var listaCanciones = []; // Variables para guardar informacion de canciones
var urlCancion = [];
var archivo; // Archivo de música que se esta reproduciendo
var mediaTimer; // Posicion de reproduccion
var isPlay = 0;
var extensiones = [".mp3",".MP3",".mp4",".MP4",".wav",".mpga"];
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
}
function onFileSystemSuccess(fileSystem) {
  // Definimos el medio de lectura sdcard en este caso
  fs = fileSystem.root;
  leer(fs); // Función para leer un directorio
}
function fail(error) {
  alert("Error "+error.code);
}
// definimos la función de lectura que nos manda a leer un directorio
function leer(files, nivel){
  if (nivel === undefined) {
      nivel = 0;
  };
  var dirRead = files.createReader();
  dirRead.readEntries(function(entries){
    var i;
    for (i=0; i<entries.length; i++) {
      if (entries[i].name === '.')
          continue;
      //alert(extension);
      // Comprobamos si es directorio, mandamos a una función recursiva para leer el subdirectorio
      if (entries[i].isDirectory) {
        // Llamada recursiva
        leer(entries[i], nivel + 1);
      }else if(entries[i].isFile){// && (entries[i].name.indexOf(".mp3") > 0 || entries[i].name.indexOf(".MP3") > 0 )){ // Comprobamos que sea achivos y mp3
        var extension = entries[i].name.substr(entries[i].name.lastIndexOf('.'));
        //alert(extension);
        if($.inArray(extension, extensiones) >= 0){
          // Agregamos las variables
          var url = entries[i].fullPath;
          var name = entries[i].name; 
          listaCanciones.push(name);
          urlCancion.push(url);
        }
      }
    }
  },fail2);
  if (nivel === 0) {
  };
}
function crearLista(){
  $('#listaC').empty();
  for (i = 0; i < urlCancion.length; i++) {
    var url = urlCancion[i];
    var nombre = listaCanciones[i];
    $listElement = $('<li>');
    $linkElement = $('<a>');
    $linkElement
    .attr('href', "#")
    .text(listaCanciones[i]);
    //.on('click',function(url, nombre){alert(url,nombre);reproducir(urlCancion[i], listaCanciones[i]);});
    //$listElement = "<li><a href='#' id='"+i+"'>";
    // Append the link to the <li> element
    $listElement.append($linkElement);
         // Append the <li> element to the <ul> element
    $('#listaC').append($listElement);
  }
  $('#listaC').listview('refresh');
}
function fail2(error) {
  alert("Failed to list directory contents: " + error.code);
}
function play(){
  if (isPlay === 0) {
    reproducirAll();
  }else{
    reanudar();
  }
}
var posicion;
function reproducirAll(){
  
}
function nada(){
  console.log("Consigue la versión PRO");
}
function reproducir(src, nombre){
  if (isPlay === 1) {
    stopAudio();
    archivo = null;
  };
  archivo = new Media(src, onSuccess, onErrors);
  $("#nombre").html(nombre);

                // Play audio
                archivo.play();
                isPlay = 1;
                // Update my_media position every second
                if (mediaTimer == null) {
                    mediaTimer = setInterval(function() {
                        // get my_media position
                        archivo.getCurrentPosition(
                            // success callback
                            function(position) {
                                if (position > -1) {
                                    setAudioPosition((position));
                                }
                            },
                            // error callback
                            function(e) {
                                console.log("Error getting pos=" + e);
                                setAudioPosition("Error: " + e);
                            }
                        );
                    }, 1000);
                }
                $( "#listaMusica" ).panel( "close" );
            }

            // Pause audio
            //
            function pauseAudio() {
                if (archivo) {
                    archivo.pause();
                }
            }

            // Stop audio
            //
            function stopAudio() {
                if (archivo) {
                    archivo.stop();
                    isPlay = 0;
                }
                clearInterval(mediaTimer);
                mediaTimer = null;
            }

            // onSuccess Callback
            //
            function onSuccess() {
                console.log("playAudio():Audio Success");
            }

            // onError Callback
            //
            function onErrors(error) {
                //alert('code: '    + error.code    + '\n' +
                  //    'message: ' + error.message + '\n');
            }

            // Set audio position
            //
            function setAudioPosition(position) {
              var min = position / 100;
              var m = min.toFixed(0);
              var sec = position.toFixed(0);
                text = "<p>"+m+":"+sec+"</p>";
                $("#duracion").html(text);
            }
function reanudar(){
  if (isPlay === 1) {
    archivo.play();
  };
}
$(document).on('click','#listaC a', function(){
  var texto = $(this).text();
  var pos = $.inArray(texto, listaCanciones);
  reproducir(urlCancion[pos], texto);
});