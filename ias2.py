#encoding:UTF-8
#Autor: José Javier Rodríguez Mota
#Descripción: Emulador de IAS

#Importamos las librerias necesarias
from math import pow

pC=0
left= True
aC=0
mQ=0
doc=open("datos.txt",'r')
memoria=doc.readlines()
doc.close()

def leerArchivo():
    #Elegimos el documento
    documento="prg1.txt"
    #Imprimimos mensaje bonito
    print("Abriendo documento "+documento+". Por favor espere...")
    #Regresamos la direccion del documento
    return documento

#8 bits de upcode y 12 de direccion
def leerInstruccion(oP,aD):
    global aC
    global mQ
    global pC
    global left
    global memoria
    aD=int(aD,16)

    #Arithmetic begin

    #ADD from memory to AC and store in AC
    if(oP=="05"):
        aC+=int(memoria[aD],16)
    #ADD absolute from memory to AC and store in AC
    if(oP=="07"):
        aC+=abs(int(memoria[aD],16))
    #SUB from memory to AC and store in AC
    if(oP=="06"):
        aC-=int(memoria[aD],16)
    #SUB absolute from memory to AC and store in AC
    if(oP=="08"):
        aC-=abs(int(memoria[aD],16))
    #MUL from memory times MQ and store in AC
    #(most significant) and MQ(least significant)
    if(oP=="0B"):
        print aD
    #DIV AC by memory and store in AC
    #(remainder) and MQ(quotient)
    if(oP=="0C"):
        c=aC
        aC%=int(memoria[aD],16)
        mQ=c//int(memoria[aD],16)
    #LSH AC times 2 and store in AC
    #shift left one bit position
    if(oP=="14"):
        aC*=2
    #RSH AC by 2 and store in AC
    #shift right one bit position
    if(oP=="15"):
        aC/=2

    #Arithmetic end
    #Jump begin

    #JUMP to memory location left
    if(oP=="0D"):
        pC=aD
        left=True
    #JUMP to memory location right
    if(oP=="0E"):
        pC=aD
        left=False
    #JUMP if AC positive to memory location left
    if(oP=="0F" and aC>=0):
        pC=aD
        left=True
    #JUMP if AC positive to memory location right
    if(oP=="10" and aC>=0):
        pC=aD
        left=False

    #Jump end
    #Load begin

    #LOAD MQ
    if(oP=="0A"):
        aC=mQ
    #LOAD MQ, M(x)
    if(oP=="09"):
        mQ=int(memoria[aD],16)
    #STOR M(x)
    if(oP=="21"):
        if(aC>=0):
            memoria[aD]=str(hex(aC))
        else:
            memoria[aD]=str(hex(int(complementoA2(abs(aC)),2)))
    #LOAD M(x)
    if(oP=="01"):
        aC=int(memoria[aD],16)
    #LOAD -M(x)
    if(oP=="02"):
        aC=int(memoria[aD],16)*(-1)
    #LOAD |M(x)|
    if(oP=="03"):
        aC=abs(int(memoria[aD],16))
    #LOAD -|M(x)|
    if(oP=="04"):
        aC=abs(int(memoria[aD],16))*(-1)

    #Load end
    #STOR begin
    #STOR end
    #HALT
    if(oP=="00" and aD==0):
        print "HALT"
        pC=len(lista)
    #END OF THE INSTRUCTIONS
    print "aC: "+str(aC)
    print "mQ: "+str(mQ)

def complementoA2(decimal):
    primero=False
    binario=""
    while(decimal!=0):
        if(primero==False):
            if(decimal%2==0):
                binario+="0"
            else:
                binario+="1"
                primero=True
        else:
            if(decimal%2==0):
                binario+="1"
            else:
                binario+="0"
        decimal//=2
    if(len(binario)<8):
        binario+="1"*(8-len(binario))

    return binario[::-1]

def main():
    global pC
    global left
    doc=open(leerArchivo(),'r')

    #Leemos la primera linea
    lista=doc.readlines()
    doc.close()

    contenido=lista[0]

    #Revisamos cada linea
    while pC!=len(lista):
        pC+=1
        opcode1=contenido[0:2]
        address1=contenido[2:5]
        opcode2=contenido[5:7]
        address2=contenido[7:10]
        if(left==True):
            left=False
            leerInstruccion(opcode1,address1)
        if(left==False):
            left=True
            leerInstruccion(opcode2,address2)
        #Cambiamos de linea
        if(len(lista)!= pC):
            contenido=lista[pC]

#Ejecutamos el codigo
main()
