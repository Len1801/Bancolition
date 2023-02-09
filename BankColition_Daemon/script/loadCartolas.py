import os
# Locales
from getFromModel import getCuentasBancarias
from getCartolas import getCartola
from setCartolas import insertCartolas

def initDownloads(data, folderPath):  
    xPath = '//*[@id="signup-form"]/a'
    for bankData in data:    
        filepath = getCartola(bankData['url'], bankData['rut'], bankData['Password'], xPath, folderPath)
        if filepath is not None:
            insertCartolas(bankData, filepath)  

def getBankData():
    dictData = getCuentasBancarias()
    folderPath = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))+"/Temp"
    folderPath = folderPath.replace('\\', '/').replace('\\', '/').replace('//', '/') #'C:/Users/hbudd/OneDrive/VS_Code/BankColition/Temp'
    
    return dictData, folderPath 

def main():
    dictData, folder = getBankData()
    initDownloads(dictData, folder)

if __name__ == "__main__":
    main()