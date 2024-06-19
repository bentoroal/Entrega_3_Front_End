var g_id_resultado ="";

//Función para agregar resultado
function agregarResultado(){
var nombre_resultado    = document.getElementById("txt_nombre_resultado").value;
var fechaHoraActual     = obtenerFechaHora();

//Validacion que no haya datos en blanco:
// funcion trim quita posibles espacios, && es funcion AND
if(nombre_resultado.trim() !== "") {

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  //Carga útil de datos
  const raw = JSON.stringify({
    "nombre_resultado": nombre_resultado,
    "fecha_registro": fechaHoraActual
});

  //Opciones de solicitud
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
    .then((response) => {
      if(response.status == 200) {
        //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Resultado agregado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
      }
      if(response.status == 400) {
          document.getElementById("cnt_alerta").innerHTML ="Resultado no pudo ser ingresado, volverá automáticamente al listado en unos segundos.";
          document.getElementById("cnt_alerta").className ="alert alert-danger";
          setTimeout(function() {
          location.href ="listar.html";
          }, 5000);
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }
else{
  document.getElementById("cnt_alerta").innerHTML ="Dejó algun campo en blanco, por favor complete la informacion solicitada";
  document.getElementById("cnt_alerta").className ="alert alert-danger";
}}


function listarResultado(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        json.forEach(completarFila);
        $('#tbl_resultado').DataTable();
      } )
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }
  //esta funcion completa datos en tabla

  function completarFila(element,index,arr){
    var fechaHoraFormateada = formatearFechaHora(element.fecha_registro)
    arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML +=
  `<tr>
  <td>${element.id_resultado}</td>
  <td>${element.nombre_resultado}</td>
  <td>${fechaHoraFormateada}</td>
  <td>
  <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning'>Actualizar</a> 
  <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger'>Eliminar</a> 
  </td>
  </tr>`
  }

function obtenerIdActualizar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_resultado = parametros.get('id');
  g_id_resultado = p_id_resultado;
  obtenerDatosActualizar(p_id_resultado);
}

function obtenerIdEliminar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_resultado = parametros.get('id');
  g_id_resultado = p_id_resultado;
  obtenerDatosEliminar(p_id_resultado);

}
function obtenerDatosEliminar(p_id_resultado){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function obtenerDatosActualizar(p_id_resultado){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
//Esta funcion inyecta datos del resultado a eliminar en el menu de confirmacion
function completarEtiqueta(element,index,arr){
  var nombre_resultado = element.nombre_resultado;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el resultado <b>" + nombre_resultado + "</b>?";
}
//Esta funcion pre-ingresa el valor original del campo a actualizar
function completarFormulario(element,index,arr){
  var nombre_resultado = element.nombre_resultado;
  document.getElementById('txt_nombre_resultado').value = nombre_resultado;
}

function actualizarResultado(){
  //Obtenemos datos que el resultado desea cambiar
    var nombre_resultado             = document.getElementById("txt_nombre_resultado").value;

//Validacion que no haya datos en blanco:
// funcion trim quita posibles espacios, && es funcion AND
if(nombre_resultado.trim() !== "") {

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //Carga útil de datos
  const raw = JSON.stringify({
    "nombre_resultado": nombre_resultado
  });
  
  //Opciones de solicitud
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/resultado/"+ g_id_resultado, requestOptions)
    .then((response) => {
      if(response.status == 200){
        //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Resultado modificado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
        }
        if(response.status == 400) {
            document.getElementById("cnt_alerta").innerHTML ="Resultado no pudo ser modificado, volverá automáticamente al listado en unos segundos.";
            document.getElementById("cnt_alerta").className ="alert alert-danger";
            setTimeout(function() {
            location.href ="listar.html";
            }, 5000);
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }

else{
  document.getElementById("cnt_alerta").innerHTML ="Dejó algun campo en blanco, por favor complete la informacion solicitada";
  document.getElementById("cnt_alerta").className ="alert alert-danger";
}
}

function eliminarResultado(){

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Opciones de solicitud
const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

//Ejecutamos solicitud
fetch("http://144.126.210.74:8080/api/resultado/"+ g_id_resultado, requestOptions)
  .then((response) => {
    if(response.status == 200){
        //Inyecta codigo al contenedor del html que mostrará la alerta al eliminar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Resultado eliminado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
        }
        if(response.status == 400) {
            document.getElementById("cnt_alerta").innerHTML ="Resultado no pudo ser eliminado, volverá automáticamente al listado en unos segundos.";
            document.getElementById("cnt_alerta").className ="alert alert-danger";
            setTimeout(function() {
            location.href ="listar.html";
            }, 5000);
        }
  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

function obtenerFechaHora(){
    var fechaHoraActual =new Date(); //new Date entrega hora actual del sistema sin parametros adentro
    //FUNCION TOLOCALESTRING LE DA FORMATO MAS SIMPLE, hay que ponerle paarametros para que coincida con formato api
    var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
        hour12 :false,
        year :'numeric',
        month :'2-digit',
        day :'2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second:'2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');//backslash es alt+92. El replace se usa para reordenar los valores de la fecha
    return fechaHoraFormateada;
      
    }
      
function formatearFechaHora(fecha_registro){ //Funcion para darle formato a fecha y hora que se muestra en el listado
var fechaHoraActual =new Date(fecha_registro); //cuando se pone valor en parentesis se le da formato a esa fecha, no la del sistema
var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
    hour12 :false,
    year :'numeric',
    month :'2-digit',
    day :'2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second:'2-digit',
    timeZone: 'UTC'
}).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');//backslash es alt+92. El replace se usa para reordenar los valores de la fecha
return fechaHoraFormateada;
}
