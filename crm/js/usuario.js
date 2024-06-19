var g_id_usuario ="";

//Función para agregar usuario
function agregarUsuario(){
//Obtenemos datos de usuario que ingresa el usuario, las var vienen de la base de datos, debe ser el mismo nombre, el txt viene del formulario de ingreso
var id_usuario          = document.getElementById("txt_id_usuario").value;
var dv                  = document.getElementById("txt_dv").value;
var nombres             = document.getElementById("txt_nombres").value;
var apellidos           = document.getElementById("txt_apellidos").value;
var email               = document.getElementById("txt_email").value;
var celular             = document.getElementById("txt_celular").value;
var username            = document.getElementById("txt_username").value;
var password            = document.getElementById("txt_password").value;
var fechaHoraActual     = obtenerFechaHora();


//Validacion que no haya datos en blanco:
// funcion trim quita posibles espacios, && es funcion AND
if(id_usuario.trim() !== "" && dv.trim() !== "" && nombres.trim() !== "" && apellidos.trim() !== "" 
&& email.trim() !== "" && celular.trim() !== "" && username.trim() !== "" 
&& password.trim() !== "") {

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  //Carga útil de datos
  const raw = JSON.stringify({
    "id_usuario": id_usuario,
    "dv": dv,
    "nombres": nombres,
    "apellidos": apellidos,
    "email": email,
    "celular": celular,
    "username": username,
    "password": password,
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
  fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
    .then((response) => {
      if(response.status == 200) {
        //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Usuario agregado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
      }
      if(response.status == 400) {
          document.getElementById("cnt_alerta").innerHTML ="Usuario no pudo ser ingresado, volverá automáticamente al listado en unos segundos.";
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


function listarUsuario(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        json.forEach(completarFila);
        $('#tbl_usuario').DataTable();
      } )
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }
  //esta funcion completa datos en tabla

  function completarFila(element,index,arr){
    var fechaHoraFormateada = formatearFechaHora(element.fecha_registro)
    arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML +=
  `<tr>
  <td>${element.id_usuario}</td>
  <td>${element.dv}</td>
  <td>${element.nombres}</td>
  <td>${element.apellidos}</td>
  <td>${element.email}</td>
  <td>${element.celular}</td>
  <td>${element.username}</td>
  <td>${fechaHoraFormateada}</td>
  <td>
  <a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning'>Actualizar</a> 
  <a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger'>Eliminar</a> 
  </td>
  </tr>`
  }

function obtenerIdActualizar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_usuario = parametros.get('id');
  g_id_usuario = p_id_usuario;
  obtenerDatosActualizar(p_id_usuario);
}

function obtenerIdEliminar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_usuario = parametros.get('id');
  g_id_usuario = p_id_usuario;
  obtenerDatosEliminar(p_id_usuario);

}
function obtenerDatosEliminar(p_id_usuario){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function obtenerDatosActualizar(p_id_usuario){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
//Esta funcion inyecta datos del usuario a eliminar en el menu de confirmacion
function completarEtiqueta(element,index,arr){
  var id_usuario = element.id_usuario;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el usuario <b>" + id_usuario + "</b>?";
}
//Esta funcion pre-ingresa el valor original del campo a actualizar
function completarFormulario(element,index,arr){
  var nombres = element.nombres;
  var apellidos = element.apellidos;
  var email = element.email;
  var celular = element.celular;
  document.getElementById('txt_nombres').value = nombres;
  document.getElementById('txt_apellidos').value = apellidos;
  document.getElementById('txt_email').value = email;
  document.getElementById('txt_celular').value = celular;
}

function actualizarUsuario(){
  //Obtenemos datos que el usuario desea cambiar
    var nombres             = document.getElementById("txt_nombres").value;
    var apellidos           = document.getElementById("txt_apellidos").value;
    var email               = document.getElementById("txt_email").value;
    var celular             = document.getElementById("txt_celular").value;

//Validacion que no haya datos en blanco:
// funcion trim quita posibles espacios, && es funcion AND
if(nombres.trim() !== "" && apellidos.trim() !== "" && email.trim() !== "" 
&& celular.trim() !== "") {

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //Carga útil de datos
  const raw = JSON.stringify({
    "nombres": nombres,
    "apellidos": apellidos,
    "email": email,
    "celular": celular,
  });
  
  //Opciones de solicitud
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/usuario/"+ g_id_usuario, requestOptions)
    .then((response) => {
      if(response.status == 200){
        //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Usuario modificado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
        }
        if(response.status == 400) {
            document.getElementById("cnt_alerta").innerHTML ="Usuario no pudo ser modificado, volverá automáticamente al listado en unos segundos.";
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

function eliminarUsuario(){

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Opciones de solicitud
const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

//Ejecutamos solicitud
fetch("http://144.126.210.74:8080/api/usuario/"+ g_id_usuario, requestOptions)
  .then((response) => {
    if(response.status == 200){
        //Inyecta codigo al contenedor del html que mostrará la alerta al eliminar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Usuario eliminado correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
        }
        if(response.status == 400) {
            document.getElementById("cnt_alerta").innerHTML ="Usuario no pudo ser eliminado, volverá automáticamente al listado en unos segundos.";
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
