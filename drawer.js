var Drawer = function()
{
    return {
        drawTowTruckInMap: drawTowTruckInMap,
        drawStatesInList: drawStatesInList
    }

    /******************************************************************************
     * Función para dibujar un acarreo en el mapa.
     */
    function drawTowTruckInMap(acarreo, map)
    {
		var info = acarreo.patente;
		
		// Creamos un marker.		
		var p = L.marker(L.latLng(acarreo.deposito.ubicacion.lat, acarreo.deposito.ubicacion.lon))
			.bindPopup(info);

		p.addTo(map);		
	}

    /******************************************************************************
     * Función para listar los estados en la página.
     */
    function drawStatesInList(estados, nodeId) {        
		estados.forEach(function(estado) {
            var li = $('<li>');
            li.append(estado.descripcion);
            $("#"+nodeId).append(li);
        });
    }
}
