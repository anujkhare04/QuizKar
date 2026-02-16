@echo off
TITLE Fix MongoDB Connection - Changing DNS to Google
COLOR 0A
CLS

echo ====================================================
echo        FIXING DNS FOR MONGODB ATLAS ACCESS
echo ====================================================
echo.
echo Asking for Administrator privileges to change DNS...
echo.

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

echo Admin privileges obtained!
echo.
echo 1. Flushing DNS Cache...
ipconfig /flushdns

echo.
echo 2. Setting DNS to Google (8.8.8.8)...
netsh interface ip set dns name="Wi-Fi" source=static addr=8.8.8.8
IF %ERRORLEVEL% NEQ 0 (
   echo FAILED to set primary DNS on "Wi-Fi". Trying "Wireless Network Connection"...
   netsh interface ip set dns name="Wireless Network Connection" source=static addr=8.8.8.8
)

echo.
echo 3. Setting Alternate DNS (8.8.4.4)...
netsh interface ip add dns name="Wi-Fi" addr=8.8.4.4 index=2
IF %ERRORLEVEL% NEQ 0 (
   netsh interface ip add dns name="Wireless Network Connection" addr=8.8.4.4 index=2
)

echo.
echo ====================================================
echo          DNS CHANGED SUCCESSFULLY!
echo ====================================================
echo.
echo Now try running your server again: npm run dev
echo.
pause
