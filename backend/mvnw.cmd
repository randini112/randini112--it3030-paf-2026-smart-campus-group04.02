@echo off
setlocal
set "BASE_DIR=%~dp0"
if "%JAVA_HOME%"=="" (
  echo Error: JAVA_HOME is not set.
  exit /b 1
)
"%JAVA_HOME%\bin\java.exe" -Dmaven.multiModuleProjectDirectory=. -classpath "%BASE_DIR%\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
exit /b %ERRORLEVEL%
