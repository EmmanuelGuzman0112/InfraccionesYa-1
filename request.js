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