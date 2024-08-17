@echo off
rem Cambia al directorio donde está el script
cd /d %~dp0

rem Inicia un servidor HTTP en el puerto 8000
start "" "python" -m http.server 8000

rem Espera unos segundos para asegurarse de que el servidor ha arrancado
timeout /t 3 > nul

rem Abre el navegador predeterminado apuntando a la aplicación
start "" "http://localhost:8000/Login/login.html"
