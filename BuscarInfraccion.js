var map;

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

function emptyInfracciones()
{
	document.getElementById('tInfracciones').innerHTML= '';
	document.getElementById('tDepositos').innerHTML= '';
	document.getElementById('hResultados').style.display = 'none';
	document.getElementById('hDeposito').style.display = 'none';
}

function mostrarNoInfracciones()
{
	document.getElementById('hResultados').style.display = 'block';
	document.getElementById('pNoHayInfraccion').style.display = 'block';
}

function buscarInfraccion(patente)
{
	var url = Config.url;
	var urlInfracciones = '/infracciones/';
	var urlTiposInfraccion = "/tiposInfraccion/";
	
	emptyInfracciones();

	//PEDIDO DE TIPO DE INFRACCIONES
	var callback = function(responseTiposInfraccion)
	{		
		//PEDIDO DE INFRACCIONES
		var callback2 = function(responseInfracciones)
		{
			//Valido que no haya infracciones para esa patente
			if(responseInfracciones.infracciones == '')
			{
				mostrarNoInfracciones();
				return;
			}
		
			CrearTInfracciones(responseInfracciones, responseTiposInfraccion);
			
			//Hace visible el H1 resultados
			document.getElementById('hResultados').style.display = 'block';
        }
        //asyncQuery(url + urlTiposInfraccion, callback2);
		asyncQuery(url + "/" + patente + urlInfracciones, callback2);
    };

	//asyncQuery(url + "/" + patente + urlInfracciones, callback);
	asyncQuery(url + urlTiposInfraccion, callback);
}

function LayoutTipoInfracion(tipoInfraccion, responseTiposInfraccion)
{
	return responseTiposInfraccion.tipos[tipoInfraccion].descripcion;
}

function mostrarDepositoInfraccion(patente, idInfraccion)
{
    var url = Config.url;
	var urlAcarreo = '/acarreos/';
	var drawer = new Drawer();

	var callback = function(responseAcarreos)
	{
		//PEDIDO DEL ACARREO
		var acarreo = responseAcarreos.acarreo;

		drawer.drawTowTruckInMap(acarreo, map);
		CrearTDeposito(responseAcarreos.acarreo.deposito);
		document.getElementById('hDeposito').style.display = 'block';
    };

	asyncQuery(url + '/' + patente + urlAcarreo + idInfraccion, callback);
}

function CrearTInfracciones(responseInfracciones, responseTiposInfraccion)
{
	//Obtener la referencia del elemento
	var body = document.getElementById("tInfracciones");

	var tabla   = document.createElement("table");
	var tblBody = document.createElement("tbody");

	CrearEncabezadoTInfracciones(tabla);

	$.each(responseInfracciones.infracciones, function(i, item)
	{
		var fila = document.createElement("tr");

		var celda3 = document.createElement("td");
		celda3.innerHTML = item.direccionRegistrada;
		fila.appendChild(celda3);

		var celda4 = document.createElement("td");
		celda4.innerHTML = LayoutTipoInfracion(item.tipoInfraccion, responseTiposInfraccion);
		fila.appendChild(celda4);

		var celda5 = document.createElement("td");
		celda5.innerHTML = item.montoAPagar;
		fila.appendChild(celda5);
		
		var celda1 = document.createElement("td");
		celda1.innerHTML = item.fechaHoraRegistro;
		fila.appendChild(celda1);
		
		var celda2 = document.createElement("td");
		celda2.innerHTML = item.fechaHoraActualizacion;
		fila.appendChild(celda2);

		if ( item.existeAcarreo )
		{		
			var idInfraccion = item.id;
			var pantente = responseInfracciones.patente;
			var verInfraccion = document.createElement("button");
			verInfraccion.innerHTML = 'Ver acarreo'; //DEFINIR MEJOR
			verInfraccion.onclick = function(){ mostrarDepositoInfraccion(pantente, idInfraccion) };
			fila.appendChild(verInfraccion);
		}
		
		//Agrega la fila al final de la tabla
		tblBody.appendChild(fila);
	});
	
	//Posiciona el <tbody> debajo del elemento <table>
	tabla.appendChild(tblBody);
	  
	//Anexa la tabla dentro del elemento
	body.appendChild(tabla);
	  
	tabla.setAttribute('class', 'table');
}

function CrearEncabezadoTInfracciones(tabla)
{
	var thead = document.createElement("thead");
	
	var encabezado = document.createElement("tr");

	var enc_direccion = document.createElement("td");
	enc_direccion.innerHTML = "Direccion";
	encabezado.appendChild(enc_direccion);

	var enc_tipoInf = document.createElement("td");
	enc_tipoInf.innerHTML = "Tipo de infraccion";
	encabezado.appendChild(enc_tipoInf);

	var enc_monto = document.createElement("td");
	enc_monto.innerHTML = "Monto";
	encabezado.appendChild(enc_monto);
	
	var enc_fechaRegistro = document.createElement("td");
	enc_fechaRegistro.innerHTML = "Fecha de registro";
	encabezado.appendChild(enc_fechaRegistro);
	
	var enc_fechaAct = document.createElement("td");
	enc_fechaAct.innerHTML = "Fecha de actualizacion";
	encabezado.appendChild(enc_fechaAct);

	var enc_acarreo = document.createElement("td");
	enc_acarreo.innerHTML = "Acarreo";
	encabezado.appendChild(enc_acarreo);
	
	thead.appendChild(encabezado);
	
	//Agrega la fila al final de la tabla (al final del elemento tblbody)
	tabla.appendChild(thead);
}

function CrearEncabezadoTDeposito(tblBody)
{
	var encaDeposito = document.createElement("tr");
	
	var enc_Nombre = document.createElement("td");
	enc_Nombre.innerHTML = "Nombre";
	encaDeposito.appendChild(enc_Nombre);
	
	var enc_Direccion = document.createElement("td");
	enc_Direccion.innerHTML = "Direccion";
	encaDeposito.appendChild(enc_Direccion);

	var enc_Telefono = document.createElement("td");
	enc_Telefono.innerHTML = "Telefono";
	encaDeposito.appendChild(enc_Telefono);

	var enc_Horarios = document.createElement("td");
	enc_Horarios.innerHTML = "Horarios";
	encaDeposito.appendChild(enc_Horarios);

	//Agrega la fila al final de la tabla (al final del elemento tblbody)
	tblBody.appendChild(encaDeposito);
}

function CrearTDeposito(responseDepositos)
{
	//Obtener la referencia del elemento
	var body = document.getElementById("tDepositos");

	var tabla   = document.createElement("table");
	var tblBody = document.createElement("tbody");

	CrearEncabezadoTDeposito(tblBody);
	var fila = document.createElement("tr");
		
	var celda1 = document.createElement("td");
	celda1.innerHTML = responseDepositos.nombre;
	fila.appendChild(celda1);
		
	var celda2 = document.createElement("td");
	celda2.innerHTML = responseDepositos.direccion;
	fila.appendChild(celda2);

	var celda3 = document.createElement("td");
	celda3.innerHTML = responseDepositos.telefono;
	fila.appendChild(celda3);

	var celda4 = document.createElement("td");
	celda4.innerHTML = responseDepositos.horarios;
	fila.appendChild(celda4);
		
	//Agrega la fila al final de la tabla
	tblBody.appendChild(fila);
	
	//Posiciona el <tbody> debajo del elemento <table>
	tabla.appendChild(tblBody);
	  
	//Anexa la tabla dentro del elemento
	body.appendChild(tabla);
	
	tabla.setAttribute('class', 'table');
}

/******************************************************************************
 * Inicio.
 */
var start = function()
{
    map = createMap('mapid');
};

$(start);