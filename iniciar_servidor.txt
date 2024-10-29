@echo off
REM Cambia al directorio donde se encuentra tu proyecto
cd "D:\Biblioteca de Windows\Escritorio\Universidad\Github\DaniSport-master"

REM Inicia Live Server (asegúrate de que Live Server esté instalado globalmente)
start "" live-server

REM Espera un poco para que el servidor se inicie
timeout /t 5

REM Abre la URL en el navegador predeterminado
start http://127.0.0.1:8080/Login/login.html
