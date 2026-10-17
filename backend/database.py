import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    try:
        driver = os.getenv("DB_DRIVER")
        server = os.getenv("DB_SERVER")
        database = os.getenv("DB_NAME")
        user = os.getenv("DB_USER")
        password = os.getenv("DB_PASSWORD")
<<<<<<< HEAD
        trust_server_certificate = os.getenv(
            "DB_TRUST_SERVER_CERTIFICATE", "yes"
        )

        connection_string = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            f"UID={user};"
            f"PWD={password};"
            f"TrustServerCertificate={trust_server_certificate};"
        )

        conn = pyodbc.connect(connection_string)

=======
        trusted_certificate = os.getenv(
            "DB_TRUST_SERVER_CERTIFICATE", "yes"
        )

        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=LAPTOP-F7NE9URR\\SQLEXPRESS;"
            "DATABASE=FootballBookingDB;"
            "Trusted_Connection=yes;"
            "Encrypt=yes;"
            "TrustServerCertificate=yes;" 
        )

>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
        return conn

    except pyodbc.Error as e:
        print("Database connection error:")
        print(e)
        return None

<<<<<<< HEAD
    except Exception as e:
        print("Unexpected error:")
        print(e)
        return None
=======
>>>>>>> 2424492bed04dead402c12d36ab5e97bec9b6cec
