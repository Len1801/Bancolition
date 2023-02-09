import pandas
import base64
import simplejson
from os import remove
# Locales
from getFromModel import insertCartola, insertMovimientosCartola

def getBase64(filename):
    
    with open(filename, "rb") as file:
        encoded_string = base64.b64encode(file.read())
    return encoded_string.decode("utf-8") #.decode("ascii")

def getHeader(filename):
    
    excel_data_df = pandas.read_excel(filename, header=None, nrows=14, na_values=None)
    dictExcel = excel_data_df.to_dict('records')
    
    #with open("getHeader.json","w") as file:
    #    file.write(json.dumps(dictExcel))    
    
    return dictExcel
    
def getBody(filename):
    
    excel_data_df = pandas.read_excel(filename, header=None, skiprows=16, na_values=None)    
    dictExcel = excel_data_df.to_dict('records')
    
    #with open("getBody.json","w") as file:
    #    file.write(json.dumps(dictExcel))    
    
    return dictExcel

def setHeader(Id_CuentaBancaria, Header, lenght, File):

    dictHeader = [{
        'Id_CuentaBancaria': Id_CuentaBancaria,
        'CuentaCorriente': Header[6][0][Header[6][0].find(': ')+2:].strip(),
        'NumeroCartola': int(Header[7][0][Header[7][0].find(': ')+2:].strip()),
        'Moneda': Header[6][2][Header[6][2].find(': ')+2:].strip(),
        'FechaDesde': Header[7][2][Header[7][2].find(': ')+2:].strip(),
        'FechaHasta': Header[7][3][Header[7][3].find(': ')+2:].strip(),
        'SaldoInicial': Header[10][0],
        'Deposito': Header[10][1],
        'OtrosAbonos': Header[10][2],
        'Cheques': Header[10][3],
        'OtrosCargos': Header[10][4],
        'Impuestos': Header[10][5],
        'SaldoFinal': Header[10][6],
        'CreditoCupoAprobado': Header[13][0],
        'CreditoMontoUtilizado': Header[13][1],
        'CreditoSaldoDisponible': Header[13][2],
        'TotalMovimientos': lenght,
        'Cuadratura': 0,
        'Archivo': File
    }]
        
    jsonHeader = simplejson.dumps(dictHeader, ignore_nan=True)

    #with open("setHeader.json","w") as file:
    #    file.write(jsonHeader) 
    
    id_Cartola = insertCartola(jsonHeader, str(Id_CuentaBancaria),str(Header[7][0][Header[7][0].find(': ')+2:].strip()))
        
    return id_Cartola[0]['ID']

def setBody(id_Cartola, Body):
    
    dictBody = []
        
    for row in Body:
        dict = [{
            'Id_Cartola': id_Cartola,
            'Monto': row[0],
            'Descripcion': row[1],
            'FechaMovimiento': row[3],
            'NumeroDocumento': row[4],
            'Sucursal': row[5],
            'CargoAbono': row[7]
        }]
        dictBody = dictBody + dict
        
        
    jsonBody = simplejson.dumps(dictBody, ignore_nan=True)
            
    #with open("Temp/setBody.json","w") as file:
    #    file.write(json.dumps(dictBody)) 
    #    file.write(jsonBody) 
    
    insertMovimientosCartola(id_Cartola, jsonBody)

def delFile(filename):
    remove(filename)
    
def insertCartolas(dictData, filename):
    File = getBase64(filename)
    Header = getHeader(filename)
    Body = getBody(filename)
    id_Cartola= setHeader(dictData['Id_CuentaBancaria'], Header, len(Body), File)
    setBody(id_Cartola, Body)
    delFile(filename)
