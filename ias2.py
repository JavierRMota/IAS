#encoding:UTF-8
#Autor: José Javier Rodríguez Mota
#Descripción: Emulador de IAS

#Importamos las librerias necesarias
from math import pow

pC=0
left= True
aC=0
mQ=0

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

    #Arithmetic begin

    #ADD from memory to AC and store in AC
    if(oP=="00000101"):
        print binToDec(aD)
    #ADD absolute from memory to AC and store in AC
    if(oP=="00000111"):
        print binToDec(aD)
    #SUB from memory to AC and store in AC
    if(oP=="00000110"):
        print binToDec(aD)
    #SUB absolute from memory to AC and store in AC
    if(oP=="00001000"):
        print binToDec(aD)
    #MUL from memory times MQ and store in AC
    #(most significant) and MQ(least significant)
    if(oP=="00001011"):
        print binToDec(aD)
    #DIV AC by memory and store in AC
    #(remainder) and MQ(quotient)
    if(oP=="00001100"):
        print binToDec(aD)
    #LSH AC times 2 and store in AC
    #shift left one bit position
    if(oP=="00010100"):
        aC*=2
    #RSH AC by 2 and store in AC
    #shift right one bit position
    if(oP=="00010101"):
        aC/=2

    #Arithmetic end
    #Jump begin

    #JUMP to memory location left
    if(oP=="00001101"):
        pC=binToDec(aD)
        left=True
    #JUMP to memory location right
    if(oP=="00001110"):
        pC=binToDec(aD)
        left=False
    #JUMP if AC positive to memory location left
    if(oP=="00001111" and aC>=0):
        pC=binToDec(aD)
        left=True
    #JUMP if AC positive to memory location right
    if(oP=="00010000" and aC>=0):
        pC=binToDec(aD)
        left=False

    #Jump end

def binToDec(binario):
    numero=0
    binario=binario[::-1]
    for x in range(len(binario)):
        numero+=int(binario[x])*pow(2,x)
    return numero

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
    doc.close
    contenido=lista[0]

    #Revisamos cada linea
    while pC!=len(lista):
        pC+=1
        opcode1=contenido[0:8]
        address1=contenido[8:20]
        opcode2=contenido[20:28]
        address2=contenido[28:40]
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
