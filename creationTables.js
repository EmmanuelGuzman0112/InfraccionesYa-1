/******************************************************************************
 * Funcion para crear la tabla Infracciones
 */
function CrearTInfracciones(responseInfracciones, responseTiposInfraccion)
{
	//Obtener la referencia del elemento
	var divInfra = document.getElementById("tInfracciones");

	var tablaInfra = document.createElement("table");
	var tblBody = document.createElement("tbody");

	CrearEncabTInfraccion(tablaInfra);

	$.each(responseInfracciones.infracciones, function(i, item)
	{
		var fila = document.createElement("tr");

		var colDireccion = document.createElement("td");
		colDireccion.innerHTML = item.direccionRegistrada;
		fila.appendChild(colDireccion);

		var colTipo = document.createElement("td");
		colTipo.innerHTML = LayoutTipoInfracion(item.tipoInfraccion, responseTiposInfraccion);
		fila.appendChild(colTipo);

		var colMonto = document.createElement("td");
		colMonto.innerHTML = item.montoAPagar;
		fila.appendChild(colMonto);
		
		var colRegistro = document.createElement("td");
		colRegistro.innerHTML = item.fechaHoraRegistro;
		fila.appendChild(colRegistro);
		
		var colActu = document.createElement("td");
		colActu.innerHTML = item.fechaHoraActualizacion;
		fila.appendChild(colActu);

		if ( item.existeAcarreo )
		{		
			var idInfraccion = item.id;
			var pantente = responseInfracciones.patente;
			var verInfraccion = document.createElement("button");
			verInfraccion.innerHTML = 'Ver acarreo';
			verInfraccion.setAttribute('class', 'btn btn-link');
			verInfraccion.onclick = function(){ buscarDepositoInfraccion(pantente, idInfraccion) };
			fila.appendChild(verInfraccion);
		}
		
		//Agrega la fila al final de la tabla
		tblBody.appendChild(fila);
	});
	
	tablaInfra.appendChild(tblBody);
	  
	//Anexa la tabla dentro del div
	divInfra.appendChild(tablaInfra);
	  
	tablaInfra.setAttribute('class', 'table');
}

function CrearEncabTInfraccion(tabla)
{
	var thead = document.createElement("thead");
	
	var header = document.createElement("tr");

	var headDireccion = document.createElement("td");
	headDireccion.innerHTML = "Direccion";
	header.appendChild(headDireccion);

	var headTipoInf = document.createElement("td");
	headTipoInf.innerHTML = "Tipo de infraccion";
	header.appendChild(headTipoInf);

	var headMonto = document.createElement("td");
	headMonto.innerHTML = "Monto";
	header.appendChild(headMonto);
	
	var headRegistro = document.createElement("td");
	headRegistro.innerHTML = "Fecha de registro";
	header.appendChild(headRegistro);
	
	var headFechaAct = document.createElement("td");
	headFechaAct.innerHTML = "Fecha de actualizacion";
	header.appendChild(headFechaAct);

	var headAcarreo = document.createElement("td");
	headAcarreo.innerHTML = "Acarreo";
	header.appendChild(headAcarreo);
	
	thead.appendChild(header);
	
	//Agrega la fila al final de la tabla (al final del elemento tblbody)
	tabla.appendChild(thead);
}

function LayoutTipoInfracion(tipoInfraccion, responseTiposInfraccion)
{
	return responseTiposInfraccion.tipos[tipoInfraccion].descripcion;
}

function CrearTDeposito(responseDepositos)
{
	//Obtener la referencia del elemento
	var divDeposito = document.getElementById("tDeposito");

	var tablaDep   = document.createElement("table");
	var tblBody = document.createElement("tbody");

	CrearEncabTDeposito(tblBody);
	var fila = document.createElement("tr");
		
	var colNombre = document.createElement("td");
	colNombre.innerHTML = responseDepositos.nombre;
	fila.appendChild(colNombre);
		
	var colDireccion = document.createElement("td");
	colDireccion.innerHTML = responseDepositos.direccion;
	fila.appendChild(colDireccion);

	var colTelefono = document.createElement("td");
	colTelefono.innerHTML = responseDepositos.telefono;
	fila.appendChild(colTelefono);

	var colHorario = document.createElement("td");
	colHorario.innerHTML = responseDepositos.horarios;
	fila.appendChild(colHorario);
		
	tblBody.appendChild(fila);
	
	tablaDep.appendChild(tblBody);
	  
	//Anexa la tabla dentro del elemento
	divDeposito.appendChild(tablaDep);
	
	tablaDep.setAttribute('class', 'table');
}

function CrearEncabTDeposito(tblBody)
{
	var header = document.createElement("tr");
	
	var headNombre = document.createElement("td");
	headNombre.innerHTML = "Nombre";
	header.appendChild(headNombre);
	
	var headDireccion = document.createElement("td");
	headDireccion.innerHTML = "Direccion";
	header.appendChild(headDireccion);

	var headTelefono = document.createElement("td");
	headTelefono.innerHTML = "Telefono";
	header.appendChild(headTelefono);

	var headHorarios = document.createElement("td");
	headHorarios.innerHTML = "Horarios";
	header.appendChild(headHorarios);

	//Agrega la fila al final de la tabla (al final del elemento tblbody)
	tblBody.appendChild(header);
}