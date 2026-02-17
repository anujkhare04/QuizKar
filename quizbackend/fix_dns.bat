@echo off
echo ==========================================
echo FIXING MONGODB DNS ERROR...
echo ==========================================
echo Setting DNS to Google (8.8.8.8)...
netsh interface ip set dns name="Wi-Fi" static 8.8.8.8
netsh interface ip add dns name="Wi-Fi" 8.8.4.4 index=2
echo.
echo Flushing DNS cache...
ipconfig /flushdns
echo.
echo ==========================================
echo FINISHED! Please try running 'npm run dev' now.
echo If it still fails, try connecting to a Mobile Hotspot.
echo ==========================================
pause
