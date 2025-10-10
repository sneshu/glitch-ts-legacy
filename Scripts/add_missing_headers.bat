@echo off
setlocal enabledelayedexpansion

SET "HEADER_EMPTY=//"
SET "HEADER_FILENAME=// File: " 
SET "HEADER_COPYRIGHT1=// Copyright (c) 2025 Sneshu. All rights reserved."
SET "HEADER_COPYRIGHT2=// Unauthorized copying or use of this code is prohibited."

echo. && echo Looking for missing headers...
for /r ..\Source %%f in (*.ts) do (
    set "line="
    set /p line=<"%%f"

    echo !line! | findstr /b /c:"//" >nul
    if errorlevel 1 (
        echo Adding missing source header to %%f
        call :AddHeader "%%f" "%%~xf" "%%~nxf"
    )
)
goto :eof

:AddHeader
> "%~1.temp" echo %HEADER_EMPTY%
>> "%~1.temp" call echo %HEADER_FILENAME%%~3
>> "%~1.temp" echo %HEADER_EMPTY%
>> "%~1.temp" echo %HEADER_COPYRIGHT1%
>> "%~1.temp" echo %HEADER_COPYRIGHT2%
>> "%~1.temp" echo %HEADER_EMPTY%
>> "%~1.temp" echo.
>> "%~1.temp" type "%~1"
move /Y "%~1.temp" "%~1" >nul
goto :eof
