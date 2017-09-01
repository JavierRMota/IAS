#IASemu
Este programa fue desarrollado por:
**José Javier Rodríguez Mota, Carlos E. Carbajal Nogués, Miguel Ángel Elizalde, Ian González**
Toda la documentación y funcionamiento se encuentra en el documento IASemu.pdf, una copia del programa con su código fuente se encuentra
anexa en el proyecto, también se puede observar el proyecto funcionando en la liga [http://naatweb.xyz/Demo/IAS](http://naatweb.xyz/Demo/IAS).
A continuación se encuentran los diferentes programas que se utilizaron para probar el emulador.

##Programa 1:
LOAD 1
ADD 1
SUB 1
STOR [0]
HALT


##Programa 2:
LOAD MQ, 2
LOAD 1
ADD 1
ADD 251
SUB 2
DIV 251
HALT

##Programa 3:
LOAD [0]
ADD [0]
STOR [1]
ADD  [0]
STOR [0]
ADD [1]
STOR [1]
ADD [0]
HALT


##Programa 4:
LOAD 251
SUB 1
STOR AC
JUMP +R[0]
HALT