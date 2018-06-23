/******************************************************************************
 * Funciones para request asincrónico utilizando XMLHttpRequest
 */
var asyncQuery = function(url, callback)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
	{
        // https://stackoverflow.com/questions/13293617/why-is-my-ajax-function-calling-the-callback-multiple-times
        if (this.readyState === 4)
		{
            if (this.status === 200)
			{
                // parseamos el resultado para obtener el objeto JavaScript
                resObj = JSON.parse(xhttp.responseText)
                // llamamos a la función callback con el objeto parseado como parámetro.
                callback(resObj);
            }
        }
    };
	
    xhttp.open("GET", url, true);
    var ret = xhttp.send();
    return ret;
}

function buscarInfraccion(patente)
{
	var url = Config.url;
	var urlInfracciones = '/infracciones/';
	var urlTiposInfraccion = "/tiposInfraccion/";

	//var map = createMap('mapid');
    //var drawer = new Drawer();

	//PEDIDO DE INFRACCIONES
	var callback = function(responseInfracciones)
	{
		//PEDIDO DE TIPO DE INFRACCIONES
		var callback2 = function(responseTiposInfraccion)
		{
			CrearTInfracciones(responseInfracciones, responseTiposInfraccion);
        }
        asyncQuery(url + urlTiposInfraccion, callback2);
    };

	asyncQuery(url + "/" + patente + urlInfracciones, callback);
}

function LayoutTipoInfracion(tipoInfraccion, responseTiposInfraccion)
{
	var_descripcion = null;
	$.each(responseTiposInfraccion.tipos, function(i, itemTipo)
	{
		if ( tipoInfraccion == itemTipo.id )
		{
			var_descripcion = itemTipo.descripcion;
			return false;
		}
	});

	return var_descripcion;
}

$('#click').click(function (event)
{
    alert("Hola Mundo");
});

function CrearTInfracciones(responseInfracciones, responseTiposInfraccion)
{
	//Obtener la referencia del elemento
	var body = document.getElementById("tInfracciones");

	var tabla   = document.createElement("table");
	var tblBody = document.createElement("tbody");

	CrearEncabezadoTInfracciones(tblBody);

	$.each(responseInfracciones.infracciones, function(i, item)
	{
		var fila = document.createElement("tr");
		
		var celda = document.createElement("td");
		celda.innerHTML = item.id;
		fila.appendChild(celda);
		
		var celda1 = document.createElement("td");
		celda1.innerHTML = item.fechaHoraRegistro;
		fila.appendChild(celda1);
		
		var celda2 = document.createElement("td");
		celda2.innerHTML = item.fechaHoraActualizacion;
		fila.appendChild(celda2);

		var celda3 = document.createElement("td");
		celda3.innerHTML = item.direccionRegistrada;
		fila.appendChild(celda3);

		var celda4 = document.createElement("td");
		celda4.innerHTML = LayoutTipoInfracion(item.tipoInfraccion, responseTiposInfraccion);
		fila.appendChild(celda4);

		var celda5 = document.createElement("td");
		celda5.innerHTML = item.montoAPagar;
		fila.appendChild(celda5);

		//VER ESTO
		/*var celda6 = document.createElement("td");
		celda6.innerHTML = item.existeAcarreo;
		fila.appendChild(celda6);*/

		var verInfraccion = document.createElement("a");
		verInfraccion.innerHTML=item.existeAcarreo;
		verInfraccion.id = "ver_infra"
		verInfraccion.href = "#";
		verInfraccion.onclick = "alert(asd)";
		fila.appendChild(verInfraccion);
 
		
		//Agrega la fila al final de la tabla
		tblBody.appendChild(fila);
	});
	
	//Posiciona el <tbody> debajo del elemento <table>
	tabla.appendChild(tblBody);
	  
	//Anexa la tabla dentro del elemento
	body.appendChild(tabla);
	  
	//Modifica el atributo "border" de la tabla y lo fija a "2";
	tabla.setAttribute("border", "1");
}

function CrearEncabezadoTInfracciones(tblBody)
{
	var encabezado = document.createElement("tr");

	var enc_id = document.createElement("td");
	enc_id.innerHTML = "ID";
	encabezado.appendChild(enc_id);
	
	var enc_fechaRegistro = document.createElement("td");
	enc_fechaRegistro.innerHTML = "Fecha de registro";
	encabezado.appendChild(enc_fechaRegistro);
	
	var enc_fechaAct = document.createElement("td");
	enc_fechaAct.innerHTML = "Fecha de actualizacion";
	encabezado.appendChild(enc_fechaAct);

	var enc_direccion = document.createElement("td");
	enc_direccion.innerHTML = "Direccion";
	encabezado.appendChild(enc_direccion);

	var enc_tipoInf = document.createElement("td");
	enc_tipoInf.innerHTML = "Tipo de infraccion";
	encabezado.appendChild(enc_tipoInf);

	var enc_monto = document.createElement("td");
	enc_monto.innerHTML = "Monto a pagar";
	encabezado.appendChild(enc_monto);

	var enc_acarreo = document.createElement("td");
	enc_acarreo.innerHTML = "Acarreo";
	encabezado.appendChild(enc_acarreo);
	
	//Agrega la fila al final de la tabla (al final del elemento tblbody)
	tblBody.appendChild(encabezado);
}

function mostrarDepositoInfraccion(patente, idInfraccion)
{
    var url = Config.url;
	var urlAcarreo = '/acarreos/';
	var drawer = new Drawer();
	var map = createMap('mapid');

	var callback = function(responseAcarreos)
	{
		//PEDIDO DEL ACARREO
		var acarreo = responseAcarreos.acarreo;

		drawer.drawTowTruckInMap(acarreo, map);
    };

	asyncQuery(url + '/' + patente + urlAcarreo + idInfraccion, callback);
}

/******************************************************************************
 * Inicio.
 */
var start = function()
{

    mostrarDepositoInfraccion('ABC123', '42');

};

$(start);

/*function generaTablaInfraccion()
{
  //Obtener la referencia del elemento
  var body = document.getElementById("tablaInfracciones");
 
  //Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");
 
  for (var i = 0; i < 2; i++)
  {
    //Crea las filas de la tabla
    var fila = document.createElement("tr");
 
    for (var j = 0; j < 2; j++)
    {
      //Crea un elemento <td> y un nodo de texto
      var celda = document.createElement("td");
	  celda.innerHTML ='HOLA';

      //var textoCelda = document.createTextNode("<a>link text</a>");
	  
      //appendChild(textoCelda);
      fila.appendChild(celda);
    }
	
	//CAMBIAR BOTON POR LINK
	var verInfraccion = document.createElement("a");
	verInfraccion.innerHTML="asd";
	verInfraccion.href="www.google.com";
	celda.appendChild(verInfraccion);
 
    //Agrega la fila al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(fila);
  }
 
  //Posiciona el <tbody> debajo del elemento <table>
  tabla.appendChild(tblBody);
  
  //Anexa la tabla dentro del elemento
  body.appendChild(tabla);
  
  //Modifica el atributo "border" de la tabla y lo fija a "2";
  tabla.setAttribute("border", "1");
}*/