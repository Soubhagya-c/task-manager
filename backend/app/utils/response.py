
def success_response(data=None, message: str = "Success"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


def error_response(message: str, code: int = 400):
    return {
        "success": False,
        "message": message,
        "error_code": code,
    }
