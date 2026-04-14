store_users_queries = {
    "INSERT": """
        INSERT INTO public.stores (first_name, last_name, email, phone, img_url, store_name, password, addresses) 
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """,
    "DELETE": """
        DELETE FROM public.stores WHERE id=%s;
    """,
    "SELECTONE": """
        SELECT id, first_name, last_name, email, phone, img_url, store_name, addresses
        FROM public.stores
        WHERE id=%s;
    """,
    "SELECTBYEMAIL": """
        SELECT id, first_name, last_name, email, phone, img_url, store_name, addresses, password
        FROM public.stores
        WHERE email=%s;
    """, # In SELECTBYEMAIL last column should always be password
    "SELECTBYPID": """
        SELECT s.id, s.first_name, s.last_name, s.email, s.phone, s.img_url, s.store_name, s.addresses, s.password 
        FROM public.stores s 
        JOIN public.products p ON p.store_id = s.id
        WHERE p.id=%s;
    """,
    "UPDATE": """
        UPDATE public.stores 
        SET {} 
        WHERE id=%s;
    """
}

product_queries = {
    "INSERT": """
        INSERT INTO public.products ("name", description, short_description, price, 
        discount_price, currency, quantity, weight, store_id, "attributes", img_urls, category) 
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """,
    "SELECTBYSTOREID": """
        SELECT id, "name", description, short_description, price, discount_price, currency, 
        quantity, weight, store_id, "attributes", img_urls, category 
        FROM public.products
        WHERE store_id = %s;
    """,
    "SELECTBYID": """
        SELECT id, "name", description, short_description, price, discount_price, currency, 
        quantity, weight, store_id, "attributes", img_urls, category 
        FROM public.products
        WHERE id = %s;
    """,
    "SELECTALL": """
        SELECT id, "name", description, short_description, price, discount_price, currency, 
        quantity, weight, store_id, "attributes", img_urls, category 
        FROM public.products;
    """,
    "UPDATEPQ": """
        UPDATE public.products SET quantity=%s
        WHERE id=%s;
    """,
    "UPDATE": """
        UPDATE public.products 
        SET {} 
        WHERE id=%s;
    """,
    "DELETE": """
        DELETE FROM public.products WHERE id=%s;
    """,
}

