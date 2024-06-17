# La Mete-o

Para este ejercicio de realización de código asíncrono me propuse varias metas:

- Encadenar respuestas de APIs, que una api me diera los insumos necesarios para llamar a la siguiente (Ejemplo: La API que determina mi ubicación a partir de mi IP o la que la determina a partir del nombre de un lugar, pasa las coordenadas a una API que devuelve el pronóstico del clima, con esta información se realiza una búsqueda dentro de otra API que retorna la URL de una imagen relacionada).
- Usar Promise para el manejo de los eventos de las APIs de geolocación propias del dispositivo.
- Que la interfase de la aplicación fuera sensible a la información suministrada por las APIs (Los colores, la saturación y la transparencia de los elementos están relacionados con la información obtenida de temperatura, sensación térmica, calidad del aire y calor percibido.)
- Que un error en la cadena de obtención de la información no me bloquee la aplicación.
- Crear una textura con la información obtenida.
- Guardar los logares dentro de una sesión y que al momento de llamarlos, evitar que bloqueen las APIs por exceso de llamadas. 

Disfruté bastante el ejercicio :)

Es más que obvio que es necesario abordar la creación de código asíncrono durante el aprendizaje de Javascrip, y esta fue mi forma de abordar esta parte de mi proceso de formación. :)
