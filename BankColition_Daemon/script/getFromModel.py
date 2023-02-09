import mysql.connector

hostname = 'localhost'
username = 'root'
password = 'admin'
database = 'bankcolition'

def getCuentasBancarias() -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    #cursor.callproc('sp_getCuentasBancarias', [])
    sql = "CALL `bankcolition`.`sp_getCuentasBancarias`()"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    mydb.close()
    return rows

def getIdCartola(Id_CuentaBancaria: str, NumeroCartola: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    sql = "call bankcolition.sp_getIdCartola("+Id_CuentaBancaria+", "+NumeroCartola+")"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    mydb.close()
    return rows

def insertCartola(pParametroJson: str, Id_CuentaBancaria: str, NumeroCartola: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    cursor.callproc('sp_jsonCartola', [pParametroJson])
    mydb.commit()
    sql = "call bankcolition.sp_getIdCartola("+Id_CuentaBancaria+", "+NumeroCartola+")"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    mydb.close()
    return rows

def insertMovimientosCartola(id_Cartola:int, pParametroJson: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    cursor.callproc('sp_jsonMovimientosCartola', [id_Cartola,pParametroJson])
    #cursor.fetchall()
    mydb.commit()
    cursor.close()
    mydb.close()
    
def deleteMovimientosCartola(id_Cartola: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    sql = "delete from bankcolition.MovimientosCartola where id_cartola = "+id_Cartola+";"
    cursor.execute(sql)
    #rows = cursor.fetchall()
    mydb.commit()
    cursor.close()
    mydb.close()
