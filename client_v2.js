
var bootstrap = function() {
    var url = Config.url;
	var urlGruas = '/gruas/';
	var urlEstados = '/estadosGruas/';
	
    var map = createMap('mapid');
    var drawer = new Drawer();

    // OPCIÓN 3: Promises. Request asincrónico evitando el callbackhell.   ****
	
    var requestGrua = function(grua_id) {
        return $.ajax(url + urlGruas + grua_id);
    }
    var requestEstado = function(estado_id) {
        return $.ajax(url + urlEstados + estado_id);
    }
    var responseExtract = function(attr, response) {
        console.log(response);
        return response[attr]
    }
    var extractGrua = function(response) {
        return responseExtract('grua', response);
    }
    var extractEstado = function(response) {
        return responseExtract('estado', response);
    }
    var drawGrua = function(grua) {
		drawer.drawTowTruckInMap(grua, map);
    }

    var resolverEstadoGrua = function(grua) {
        // pedimos el estado con el estado_id, y retornamos la grua completa
        return requestEstado(grua.estado_id)
               .then(function(response){
                    grua.estado = response.estado;
                    delete grua.estado_id;                    
                    return grua;        
                });
    }

    // comenzamos la ejecución:
    
	requestGrua(3)                  // pedimos la grua al servidor
        .then(extractGrua)          // extraemos la grua de la respuesta del servidor
        .then(resolverEstadoGrua)   // resolvemos el estado        
        .then(drawGrua)             // dibujamos la grua con su estado
        .done(function() {
            console.log("Fin.");
        });

    // FIN OPCIÓN 3 ***********************************************************
};

$(bootstrap);
