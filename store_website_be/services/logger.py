from logging import Logger, Formatter, StreamHandler

def setup_logger():
    streamHandler = StreamHandler()
    formatter = Formatter(
        fmt="%(levelname)s %(asctime)s %(filename)s:%(funcName)s:%(lineno)d %(message)s"
    )

    streamHandler.setFormatter(formatter)
    logger = Logger('store_website_be')
    logger.setLevel(10)
    logger.handlers = []
    logger.addHandler(streamHandler)

    return logger

log = setup_logger()
    