@echo off
echo Installing dependencies...

REM Install Frontend Dependencies
cd /d "C:\Users\Dreammaker\3D Objects\project-bolt-sb1-jbtudtim\project\src"
npm install

REM Install Backend Dependencies
cd /d "C:\Users\Dreammaker\3D Objects\project-bolt-sb1-jbtudtim\project\src\src\legal-dashboard-api"
npm install --ignore-scripts
npm install ts-node typescript @types/node --save-dev

echo Dependencies installed! Starting servers...

REM Start Backend
start "Backend" cmd /k "cd /d \"C:\Users\Dreammaker\3D Objects\project-bolt-sb1-jbtudtim\project\src\src\legal-dashboard-api\" && npm run dev"

REM Wait and Start Frontend
timeout /t 5 /nobreak > nul
cd /d "C:\Users\Dreammaker\3D Objects\project-bolt-sb1-jbtudtim\project\src"
start "Frontend" cmd /k "npm run dev"

pause
