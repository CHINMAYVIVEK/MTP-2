from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import execute_batch
import json
from decouple import config
from services.logger import log
from services.DB.sql_queries import store_users_queries, product_queries
from psycopg2.errors import UniqueViolation
from Exceptions.python_exceptions import CustomException
from services.utils import create_update_query_store_users_data, create_update_query_product_quantity_data, create_update_query_product_data

class PostgreeDB():
    instance = None

    @classmethod
    def __new__(cls, *args, **kwargs):
        if cls.instance is None:
            cls.instance = super().__new__(cls)
        return cls.instance
    
    def init_pool(self):
        try:
            db_pool = ThreadedConnectionPool(
                minconn=1,
                maxconn=10, 
                dsn=self.dsn,
                keepalives=1,
                keepalives_idle=30, 
                keepalives_interval=10, 
                keepalives_count=5
            )
            return db_pool
        
        except Exception as e:
            log.error("Failed to initiate the connection pool", exc_info=True)
            raise CustomException(message="Error in init_pool function")

    def __init__(self):
        if hasattr(self, "pool"):
            return 
            
        env = config('env')
        if env == "dev":
            self.dsn = config('pg-dsn', cast=str) 
        elif env == "prd": 
            self.dsn = config("pg-dsn-prd", cast=str)
        else:
            raise CustomException(message="Error in __init__ function")
        
        self.pool = self.init_pool()

    def close(self) -> None:
        if self.pool:
            self.pool.closeall()
    
    def insert_store_user(self, data) -> str:
        query = store_users_queries["INSERT"]
        generated_id = ""
        log.debug("Insert Store User Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (data.first_name, data.last_name, data.email, 
                                    data.phone, data.img_url, data.store_name, data.password, json.dumps(data.addresses)))
                generated_id = cur.fetchone()[0]
                log.debug("Store User Generated ID {}".format(generated_id))
            conn.commit()
            
        except UniqueViolation as e:
            log.error("insert_store_user => UniqueViolation", exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(type="DB_UNIQUE_VIOLATION", message="Email id already used.")
        
        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in insert_store_user function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        return generated_id
    
    def delete_store_user(self, user_id: str) -> None:
        query = store_users_queries["DELETE"]
        log.debug("DELETE Store User Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (user_id,))
            conn.commit()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in delete_store_user function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        
    def update_store_user(self, data, user_id: str) -> None:
        set_part = create_update_query_store_users_data(data)
        query = store_users_queries["UPDATE"].format(set_part)
        log.debug("UPDATE Store User Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (user_id,))
            conn.commit()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in update_store_user function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
    
    def get_user_by_email(self, email: str) -> tuple:
        query = store_users_queries["SELECTBYEMAIL"]
        log.debug("SELECT BY EMAIL Store User Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (email,))
                data = cur.fetchone()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in get_user_by_email function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        
        if data is None:
                raise CustomException(type="ID_INVALID", message="User Id not found.")
        
        return data

    def get_user_by_product_id(self, product_id: str) -> tuple:
        query = store_users_queries["SELECTBYPID"]
        log.debug("SELECT BY Product Id Store User Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (product_id,))
                data = cur.fetchone()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in get_user_by_product_id function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        
        if data is None:
                raise CustomException(type="ID_INVALID", message="Product Id not found.")
        
        return data

    def get_products_by_store_id(self, store_id: str) -> list[tuple]:
        query = product_queries["SELECTBYSTOREID"]
        log.debug("SELECT BY STORE ID Product Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn()
            with conn.cursor() as cur:
                cur.execute(query, (store_id,))
                data = cur.fetchall()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in get_products_by_store_id function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        
        if data is None:
                raise CustomException(type="ID_INVALID", message="Invalid Store Id")
        
        if len(data) == 0:
                raise CustomException(type="EMPTY_TABLE", message="No product found.")
        
        return data

    def get_product_by_product_id(self, product_id: str) -> tuple:
        query = product_queries["SELECTBYID"]
        log.debug("SELECT BY ID Product Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (product_id,))
                data = cur.fetchone()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in get_product_by_product_id function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        
        if data is None:
                raise CustomException(type="ID_INVALID", message="Invalid Product Id")
        
        return data
    
    def get_products(self) -> list[tuple]:
        query = product_queries["SELECTALL"]
        log.debug("SELECT ALL Products Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn()
            with conn.cursor() as cur:
                cur.execute(query)
                data = cur.fetchall()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in get_products function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        
        if data is None:
                raise CustomException(type="EMPTY_TABLE", message="No product data found")
        
        return data

    def insert_product(self, data) -> str:
        product_query = product_queries["INSERT"]
        generated_id = ""
        log.debug("Insert Product Query {}".format(product_query))

        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(product_query, (data.name, data.description, data.shortDescription, 
                                    data.price, data.discountPrice, data.currency, data.quantity, 
                                    data.weight, data.storeUserId, json.dumps(data.attributes), 
                                    json.dumps(data.images), data.category))
                generated_id = cur.fetchone()[0]
                log.debug("Product Generated ID {}".format(generated_id))
            conn.commit()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in insert_product function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
        return generated_id

    def update_product(self, product_id, data) -> None:
        set_part = create_update_query_product_data(data)
        query = product_queries["UPDATE"].format(set_part)
        log.debug("UPDATE Product Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (product_id,))
            conn.commit()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in update_product function")
        
        finally:
            if conn:
                self.pool.putconn(conn)

    def update_product_quantity(self, data) -> None:
        data = create_update_query_product_quantity_data(data)
        query = product_queries["UPDATEPQ"]
        log.debug("UPDATE Products Quantity Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                execute_batch(cur, query, data)
            conn.commit()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in update_product_quantity function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
    
    def delete_product(self, product_id: str) -> None:
        query = product_queries["DELETE"]
        log.debug("DELETE Product Query {}".format(query))
        
        conn = None 
        try:
            conn = self.pool.getconn() 
            with conn.cursor() as cur:
                cur.execute(query, (product_id,))
            conn.commit()

        except Exception as e:
            log.error(e, exc_info=True)
            if conn:
                conn.rollback()
            raise CustomException(message="Error in delete_product function")
        
        finally:
            if conn:
                self.pool.putconn(conn)
    