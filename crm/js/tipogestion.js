var g_id_tipo_gestion ="";

//Función para agregar tipo de gestión
function agregarTipoGestion(){
//Obtenemos el tipo de gestión que ingresa el usuario
var nombre_tipo_gestion = document.getElementById("txt_nombre").value;
var fechaHoraActual     = obtenerFechaHora();

//Validacion que no haya datos en blanco:
// funcion trim quita posibles espacios, && es funcion AND
if(nombre_tipo_gestion.trim() !== "") {

//Encabezado de la solicitud
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Carga útil de datos
const raw = JSON.stringify({
  "nombre_tipo_gestion": nombre_tipo_gestion,
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
  fetch("http://144.126.210.74:8080/api/tipo_gestion", requestOptions)
    .then((response) => {
      if(response.status == 200) {
        //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Tipo de gestion agregado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
      }
      if(response.status == 400) {
        document.getElementById("cnt_alerta").innerHTML ="Tipo de gestion no pudo ser ingresado, volverá automáticamente al listado en unos segundos.";
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


function listarTipoGestion(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=400", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_tipo_gestion').DataTable();
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
//esta funcion completa datos en tabla
// Se debe tomar este formato para dar formato a fecha y usar en todas las otras funciones
function completarFila(element,index,arr){
  var fechaHoraFormateada = formatearFechaHora(element.fecha_registro)
  arr[index] = document.querySelector("#tbl_tipo_gestion tbody").innerHTML +=
`<tr>
<td>${element.id_tipo_gestion}</td>
<td>${element.nombre_tipo_gestion}</td>
<td>${fechaHoraFormateada}</td>
<td>
<a href='actualizar.html?id=${element.id_tipo_gestion}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_tipo_gestion}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}
function obtenerIdActualizar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_tipo_gestion = parametros.get('id');
  g_id_tipo_gestion = p_id_tipo_gestion;
  obtenerDatosActualizar(p_id_tipo_gestion);

}
function obtenerIdEliminar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_tipo_gestion = parametros.get('id');
  g_id_tipo_gestion = p_id_tipo_gestion;
  obtenerDatosEliminar(p_id_tipo_gestion);

}
function obtenerDatosEliminar(p_id_tipo_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion/"+p_id_tipo_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function obtenerDatosActualizar(p_id_tipo_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion/"+p_id_tipo_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr){
  var nombre_tipo_gestion = element.nombre_tipo_gestion;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el tipo de gestión <b>" + nombre_tipo_gestion + "</b>?";


}

function completarFormulario(element,index,arr){
  var nombre_tipo_gestion = element.nombre_tipo_gestion;
  document.getElementById('txt_nombre').value = nombre_tipo_gestion;

}

function actualizarTipoGestion(){
  //Obtenemos el tipo de gestión que ingresa el usuario
  var nombre_tipo_gestion = document.getElementById("txt_nombre").value;

//Validacion que no haya datos en blanco:
// funcion trim quita posibles espacios, && es funcion AND
if(nombre_tipo_gestion.trim() !== "") {
   //Encabezado de la solicitud
   const myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/json");
   
   //Carga útil de datos
   const raw = JSON.stringify({
     "nombre_tipo_gestion": nombre_tipo_gestion
   });
   
   //Opciones de solicitud
   const requestOptions = {
     method: "PATCH",
     headers: myHeaders,
     body: raw,
     redirect: "follow"
   };
   
   //Ejecutamos solicitud
   fetch("http://144.126.210.74:8080/api/tipo_gestion/"+ g_id_tipo_gestion, requestOptions)
     .then((response) => {
       if(response.status == 200){
         //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Tipo de Gestion modificado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
       }
       if(response.status == 400) {
        document.getElementById("cnt_alerta").innerHTML ="Tipo de Gestion no pudo ser modificado, volverá automáticamente al listado en unos segundos.";
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
  
 
  function eliminarTipoGestion(){

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 
    //Opciones de solicitud
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    //Ejecutamos solicitud
    fetch("http://144.126.210.74:8080/api/tipo_gestion/"+ g_id_tipo_gestion, requestOptions)
      .then((response) => {
        if(response.status == 200){
        //Inyecta codigo al contenedor del html que mostrará la alerta al eliminar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Tipo de gestion eliminado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
        }
        if(response.status == 400){
          document.getElementById("cnt_alerta").innerHTML ="Tipo de gestion no pudo ser eliminado, volverá automáticamente al listado en unos segundos.";
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
  //FUNCION TOLOCALESTRING LE DA FORMATO MAS SIMPLE, hay que ponerle paarametros para que coincida con format api
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