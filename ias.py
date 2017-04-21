def menu(opcion):
    if(opcion!=4):
        print "please make your selection:\n1. Bin numbers\n2. Hex numbers\n3. Dec numbers\n4. Show me the commands to build my program\n-1. Exit IASemu"
    if(opcion==4):
        print ""
def main():
    print "Welcome to the IASemu\n"
    opcion=0
    while(True):
        menu(opcion)
        opcion=int(raw_input())
        if(opcion==-1):
            print "Thank you for using IASemu"
            break
        if(opcion == 1):
            numeros= "bin"
        if(opcion == 2):
            numeros= "hex"
        if(opcion == 3):
            numeros= "dec"
        print numeros
main()
