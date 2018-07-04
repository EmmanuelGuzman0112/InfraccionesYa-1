var map;

function buscarInfraccion(patente)
{
	var url = Config.url;
	var urlInfracciones = '/infracciones/';
	var urlTiposInfraccion = "/tiposInfraccion/";
	
	cleanResults();

	//PEDIDO DE INFRACCIONES
	var callback = function(responseInfracciones)
	{	
		//Valido que no haya infracciones para esa patente
		if(responseInfracciones.infracciones == '')
		{
			mostrarNoInfracciones(patente);
			return;
		}
			
		//PEDIDO DE TIPO DE INFRACCIONES
		var callback2 = function(responseTiposInfraccion)
		{
			CrearTInfracciones(responseInfracciones, responseTiposInfraccion);
			
			//Hace visible el H1 resultados
			document.getElementById('hResultados').style.display = 'block';
        }
        asyncQuery(url + urlTiposInfraccion, callback2);
    };

	asyncQuery(url + "/" + patente + urlInfracciones, callback);
}

function cleanResults()
{
	document.getElementById('tInfracciones').innerHTML= '';
	document.getElementById('tDeposito').innerHTML= '';
	document.getElementById('hResultados').style.display = 'none';
	document.getElementById('hDeposito').style.display = 'none';
	document.getElementById('pNoHayInfraccion').innerHTML= '';
}

function mostrarNoInfracciones(patente)
{
	document.getElementById('hResultados').style.display = 'block';
	
	var paragraph_NoInfraccion = document.getElementById('pNoHayInfraccion');
	paragraph_NoInfraccion.innerHTML = 'El dominio ' + patente + ' no posee infracciones a la fecha.';
	paragraph_NoInfraccion.style.display = 'block';
}

function buscarDepositoInfraccion(patente, idInfraccion)
{
	document.getElementById('tDeposito').innerHTML= '';
	
    var url = Config.url;
	var urlAcarreo = '/acarreos/';
	var drawer = new Drawer();

	//PEDIDO DEL ACARREO
	var callback = function(responseAcarreos)
	{
		var acarreo = responseAcarreos.acarreo;

		drawer.drawTowTruckInMap(acarreo, map);
		CrearTDeposito(responseAcarreos.acarreo.deposito);
		document.getElementById('hDeposito').style.display = 'block';
    };

	asyncQuery(url + '/' + patente + urlAcarreo + idInfraccion, callback);
}

/******************************************************************************
 * Inicio.
 */
var start = function()
{
    map = createMap('mapid');
};

$(start);