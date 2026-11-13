@echo off
set "USERPROFILE=D:\txhy\vibe\w1"
set "GIT_SSH_VARIANT=simple"
set "GIT_SSH=C:\Windows\System32\OpenSSH\ssh.exe"
set "GIT_TRACE=1"
cd /d C:\Users\xy\AppData\Local\Temp\as-bundle-inspect-20261113
git push as-github:55ttyy/as.git main:main
exit /b %errorlevel%
