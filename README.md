# backend-node
Para hacer uso esta aplicacion con sus modulos usar el comando 
`npm install`

# Descripción de la aplicación

## Versión de Node.JS
* v10.16.0

## Versión de MySQL
* V5.7.26

## Funciones
* Esta aplicación se conecta a un gestor de base de datos MySQL.
* El llenado al BD se realiza mediante la carga de un archivo con las extenciones .csv .xlsx y xlx.
* La aplicación solo permitira una session de votación en curso, en la cual se bloquearan los servicios de creación modificación o eliminación de jurados, aspirantes, profesores y estudiantes.

## Rutas
* `/upload`. Esta ruta es para cargar el archivo con extenciones xls, xlxs, csv.
* `/jury`.  Ruta que me permite asignar los jurados para las mesas de votación, con los servicion GET, POST, PUT, y DELETE. 
* `/session`. Servicio que permite la creación de una session de votación asignando el dia y la hora de inicio y hora de finilización de la votqación.
* `/teachers`. Servicio para profesores GET, POST, PUT, y DELETE.


