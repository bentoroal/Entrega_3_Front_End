var g_id_gestion ="";

//Función para agregar gestión
function agregarGestion(){
//Obtenemos datos de gestión que ingresa el usuario, las var vienen de la base de datos, debe ser el mismo nombre, el txt viene del formulario de ingreso
var id_usuario        = document.getElementById("sel_id_usuario").value;
var id_cliente        = document.getElementById("sel_id_cliente").value;
var id_tipo_gestion   = document.getElementById("sel_id_tipo_gestion").value;
var id_resultado      = document.getElementById("sel_id_resultado").value;
var comentarios       = document.getElementById("txt_comentarios").value;
var fechaHoraActual     = obtenerFechaHora();

//Validacion que no haya datos en blanco:
// funcion trim quita posibles espacios, && es funcion AND
if(id_usuario.trim() !== "" && id_cliente.trim() !== "" && id_tipo_gestion.trim() !== "" && id_resultado.trim() !== "" 
&& comentarios.trim() !== "") {
  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  //Carga útil de datos
  const raw = JSON.stringify({
    "id_usuario": id_usuario,
    "id_cliente": id_cliente,
    "id_tipo_gestion": id_tipo_gestion,
    "id_resultado": id_resultado,
    "comentarios": comentarios,
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
  fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
    .then((response) => {
      if(response.status == 200) {
        //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Gestion agregada correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
      }
      if(response.status == 400) {
        document.getElementById("cnt_alerta").innerHTML ="Gestion no pudo ser ingresada, volverá automáticamente al listado en unos segundos.";
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

function listarGestion(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
    "query": "select ges.id_gestion as id_gestion,cli.id_cliente, ges.comentarios as comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as nombre_cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as nombre_usuario,tge.nombre_tipo_gestion as nombre_tipo_gestion,res.nombre_resultado as nombre_resultado,ges.fecha_registro as fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado "});
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function completarFila(element,index,arr){
  arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML +=
`<tr>
<td>${element.id_gestion}</td>
<td>${element.nombre_usuario}</td>
<td>${element.nombre_cliente}</td>
<td>${element.nombre_tipo_gestion}</td>
<td>${element.nombre_resultado}</td>
<td>${element.comentarios}</td>
<td>${element.fecha_registro}</td>
<td>
<a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}
function obtenerIdActualizar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosActualizar(p_id_gestion);

}
function obtenerIdEliminar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosEliminar(p_id_gestion);

}
function obtenerDatosEliminar(p_id_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function obtenerDatosActualizar(p_id_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr){
  var id_gestion = element.id_gestion;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar la gestion gestión id  <b>" + id_gestion + "</b>?";


}
function actualizarGestion(){
  //Obtenemos datos que el usuario desea cambiar
  var id_usuario        = document.getElementById("sel_id_usuario").value;
  var id_cliente        = document.getElementById("sel_id_cliente").value;
  var id_tipo_gestion   = document.getElementById("sel_id_tipo_gestion").value;
  var id_resultado      = document.getElementById("sel_id_resultado").value;
  var comentarios       = document.getElementById("txt_comentarios").value;
  
  //Validacion que no haya datos en blanco:
  // funcion trim quita posibles espacios, && es funcion AND
  if(id_usuario.trim() !== "" && id_cliente.trim() !== "" && id_tipo_gestion.trim() !== "" 
  && id_resultado.trim() !== "" && comentarios.trim() !== "") {
  
    //Encabezado de la solicitud
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    //Carga útil de datos
    const raw = JSON.stringify({
    "id_usuario": id_usuario,
    "id_cliente": id_cliente,
    "id_tipo_gestion": id_tipo_gestion,
    "id_resultado": id_resultado,
    "comentarios": comentarios,
    });
    
    //Opciones de solicitud
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    //Ejecutamos solicitud
    fetch("http://144.126.210.74:8080/api/gestion/"+ g_id_gestion, requestOptions)
      .then((response) => {
        if(response.status == 200){
          //Inyecta codigo al contenedor del html que mostrará la alerta al ingresar correctamente registro
          document.getElementById("cnt_alerta").innerHTML ="Gestion modificada correctamente, volverá automáticamente al listado en unos segundos.";
          document.getElementById("cnt_alerta").className ="alert alert-success";
          // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
          setTimeout(function() {
          location.href ="listar.html";
          }, 5000);
          }
          if(response.status == 400) {
              document.getElementById("cnt_alerta").innerHTML ="Gestion no pudo ser modificada, volverá automáticamente al listado en unos segundos.";
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

function eliminarGestion(){

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//Opciones de solicitud
const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

//Ejecutamos solicitud
fetch("http://144.126.210.74:8080/api/gestion/"+ g_id_gestion, requestOptions)
  .then((response) => {
    if(response.status == 200){
        //Inyecta codigo al contenedor del html que mostrará la alerta al eliminar correctamente registro
        document.getElementById("cnt_alerta").innerHTML ="Gestion eliminada correctamente, volverá automáticamente al listado en unos segundos.";
        document.getElementById("cnt_alerta").className ="alert alert-success";
        // Redirige a una nueva URL después de 5 segundos (5000 milisegundos)
        setTimeout(function() {
        location.href ="listar.html";
        }, 5000);
        }
        if(response.status == 400) {
            document.getElementById("cnt_alerta").innerHTML ="Gestion no pudo ser eliminada, volverá automáticamente al listado en unos segundos.";
            document.getElementById("cnt_alerta").className ="alert alert-danger";
            setTimeout(function() {
            location.href ="listar.html";
            }, 5000);
        }
  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
    


//Funciones para hacer lista desplegable
//Funciones para desplegar Resultado
function cargarSelectResultado(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOptionResultado);
      
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarOptionResultado(element,index,arr){
  arr[index] = document.querySelector("#sel_id_resultado").innerHTML +=
  `<option value='${element.id_resultado}'> ${element.nombre_resultado} </option>`
}
//Funciones para desplegar Cliente
    function cargarSelectCliente(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          json.forEach(completarOptionCliente);
          
        } )
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
    function completarOptionCliente(element,index,arr){
      arr[index] = document.querySelector("#sel_id_cliente").innerHTML +=
      `<option value='${element.id_cliente}'> ${element.nombres} ${element.apellidos} </option>`
    }

//Funciones para desplegar Usuario
function cargarSelectUsuario(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOptionUsuario);
      
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarOptionUsuario(element,index,arr){
  arr[index] = document.querySelector("#sel_id_usuario").innerHTML +=
  `<option value='${element.id_usuario}'> ${element.username} </option>`
}

//Funciones para desplegar Tipo Gestion

function cargarSelectTipoGestion(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOptionTipoGestion);
      
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarOptionTipoGestion(element,index,arr){
  arr[index] = document.querySelector("#sel_id_tipo_gestion").innerHTML +=
  `<option value='${element.id_tipo_gestion}'> ${element.nombre_tipo_gestion} </option>`
}


//Funcion que llama a todas las funciones para cargar lista, se usa en el crear html en onload
    function cargarListasDesplegables(){
    cargarSelectResultado();
    cargarSelectCliente();
    cargarSelectUsuario();
    cargarSelectTipoGestion();  
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
  