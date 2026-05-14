import mysql.connector
import os

hostname = os.environ.get('DB_HOST', 'localhost')
username = os.environ.get('DB_USER', 'root')
password = os.environ.get('DB_PASS', '')
database = os.environ.get('DB_SCHEMA', 'bankcolition')


def getCuentasBancarias() -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    sql = "CALL `bankcolition`.`sp_getCuentasBancarias`()"
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    mydb.close()
    return rows


def getIdCartola(Id_CuentaBancaria: str, NumeroCartola: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    cursor.callproc('sp_getIdCartola', [Id_CuentaBancaria, NumeroCartola])
    rows = []
    for result in cursor.stored_results():
        rows = result.fetchall()
    cursor.close()
    mydb.close()
    return rows


def insertCartola(pParametroJson: str, Id_CuentaBancaria: str, NumeroCartola: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    cursor.callproc('sp_jsonCartola', [pParametroJson])
    mydb.commit()
    cursor.callproc('sp_getIdCartola', [Id_CuentaBancaria, NumeroCartola])
    rows = []
    for result in cursor.stored_results():
        rows = result.fetchall()
    cursor.close()
    mydb.close()
    return rows


def insertMovimientosCartola(id_Cartola: int, pParametroJson: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    cursor.callproc('sp_jsonMovimientosCartola', [id_Cartola, pParametroJson])
    mydb.commit()
    cursor.close()
    mydb.close()


def deleteMovimientosCartola(id_Cartola: str) -> dict:
    mydb = mysql.connector.connect(host=hostname, user=username, passwd=password, database=database)
    cursor = mydb.cursor(dictionary=True)
    cursor.execute("DELETE FROM bankcolition.MovimientosCartola WHERE id_cartola = %s", (id_Cartola,))
    mydb.commit()
    cursor.close()
    mydb.close()
