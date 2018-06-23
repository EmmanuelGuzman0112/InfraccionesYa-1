
/******************************************************************************
 * Funciones para request asincrónico y sincrónico utilizando XMLHttpRequest
 */
var asyncQuery = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // https://stackoverflow.com/questions/13293617/why-is-my-ajax-function-calling-the-callback-multiple-times
        if (this.readyState === 4) {
            if (this.status === 200) {
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

var syncQuery = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    // El browser (Chrome) dispara una excepción:
    // [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental
    // effects to the end user's experience.
    // For more help, check https://xhr.spec.whatwg.org/.
    xhttp.send();

    if (xhttp.status === 200) {
        resObj = JSON.parse(xhttp.responseText)
        return resObj;
    }
    return null;
}

/******************************************************************************
 * Inicio.
 */
var bootstrap = function() {
    var url = Config.url;
	var urlGruas = '/gruas/';
	var urlEstados = '/estadosGruas/';

    var map = createMap('mapid');
    var drawer = new Drawer();

    // OPCIÓN 1: Request asincrónico. *****************************************
    // dibujar los incidentes de manera asincrónica
    //pedimos los tipos
	
	var callback = function(response) {
		drawer.drawStatesInList(response.estados, 'states');
		
		var states = response.estados.reduce(function(dict, state) {
			dict[state.id] = state;			
			return dict;
		}, {});

		//pedimos la grua 1
		var callback2 = function(response) {
			console.log(states);
			var grua = response.grua;

            console.log(grua);

            grua.estado = states[response.grua.estado_id];            
            delete grua.estado_id;

            console.log(grua);

			drawer.drawTowTruckInMap(grua, map);
        }
		asyncQuery(url + urlGruas + "1", callback2);
		//

    };
    asyncQuery(url + urlEstados, callback);
	
    // Esta opción deriva en el callbackhell
    // Referencias:
    // 1. http://callbackhell.com/
    // 2. https://stackoverflow.com/questions/25098066/what-the-hell-is-callback-hell-and-how-and-why-rx-solves-it
    // FIN OPCIÓN 1 ***********************************************************

    // OPCIÓN 2: Request sincrónico.  *****************************************
    // dibujar las gruas de manera sincrónica
	var skip = function(response) {
	};
	
	//pedimos la grua 5
    var response1 = syncQuery(url + urlGruas + "6", skip);
    
    if (response1) {
		var estado_id = response1.grua.estado_id;
		
		var response2 = syncQuery(url + urlEstados + estado_id, skip);
		
        if (response2) {
		    var grua = response1.grua;
		    
            grua.estado = response2.estado;
            delete grua.estado_id;

		    drawer.drawTowTruckInMap(grua, map);
        }    

    }

    // FIN OPCIÓN 2 ***********************************************************

};

$(bootstrap);
