import os
import sys

import bcrypt


sys.path.append(

    os.path.dirname(

        os.path.dirname(
            __file__
        )
    )
)


from database import get_connection


class AuthenticationError(
    Exception
):

    def __init__(
        self,
        message,
        status_code=401
    ):

        super().__init__(
            message
        )

        self.message = message

        self.status_code = (
            status_code
        )


def _normalize(
    value
):

    return str(
        value
        or ""
    ).strip()


def _is_bcrypt_hash(
    password_hash
):

    value = _normalize(
        password_hash
    )

    return value.startswith(
        (
            "$2a$",
            "$2b$",
            "$2y$"
        )
    )


def verify_password(
    password,
    password_hash
):

    password = str(
        password
        or ""
    )

    stored_hash = (
        _normalize(
            password_hash
        )
    )


    if (
        not password
        or
        not stored_hash
    ):

        return False


    if not _is_bcrypt_hash(
        stored_hash
    ):

        return False


    try:

        return bcrypt.checkpw(

            password.encode(
                "utf-8"
            ),

            stored_hash.encode(
                "utf-8"
            ),
        )


    except (
        TypeError,
        ValueError
    ):

        return False


def _row_to_user(
    user
):

    return {

        "UserID":
            user.UserID,

        "FullName":
            user.FullName,

        "Email":
            user.Email,

        "Phone":
            user.Phone,

        "Role":
            _normalize(
                user.Role
            ).upper(),

        "Status":
            _normalize(
                user.Status
            ).upper(),
    }


def authenticate_user(
    account,
    password
):

    account = _normalize(
        account
    )

    password = str(
        password
        or ""
    )


    if (
        not account
        or
        not password
    ):

        raise AuthenticationError(

            "Vui lòng nhập tài khoản và mật khẩu",

            400,
        )


    conn = get_connection()


    if conn is None:

        raise AuthenticationError(

            "Không thể kết nối database",

            500,
        )


    cursor = conn.cursor()


    try:

        cursor.execute(

            """
            SELECT
                UserID,
                FullName,
                Email,
                Phone,
                PasswordHash,
                Role,
                Status

            FROM Users

            WHERE Email = ?
               OR Phone = ?
            """,

            account,
            account,
        )


        user = cursor.fetchone()


        if user is None:

            raise AuthenticationError(

                "Sai tài khoản hoặc mật khẩu",

                401,
            )


        status = _normalize(
            user.Status
        ).upper()


        if status != "ACTIVE":

            raise AuthenticationError(

                "Tài khoản hiện không hoạt động",

                403,
            )


        if not verify_password(

            password,

            user.PasswordHash,
        ):

            if not _is_bcrypt_hash(
                user.PasswordHash
            ):

                raise AuthenticationError(

                    "Mật khẩu trong database chưa được migrate sang bcrypt. Hãy chạy scripts/hash_existing_passwords.py một lần.",

                    500,
                )


            raise AuthenticationError(

                "Sai tài khoản hoặc mật khẩu",

                401,
            )


        return _row_to_user(
            user
        )


    finally:

        cursor.close()

        conn.close()


def get_user_by_id(
    user_id
):

    try:

        user_id = int(
            user_id
        )


    except (
        TypeError,
        ValueError
    ):

        return None


    conn = get_connection()


    if conn is None:

        return None


    cursor = conn.cursor()


    try:

        cursor.execute(

            """
            SELECT
                UserID,
                FullName,
                Email,
                Phone,
                Role,
                Status

            FROM Users

            WHERE UserID = ?
            """,

            user_id,
        )


        user = cursor.fetchone()


        if user is None:

            return None


        return _row_to_user(
            user
        )


    finally:

        cursor.close()

        conn.close()