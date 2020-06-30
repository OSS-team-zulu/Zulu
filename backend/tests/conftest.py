import pytest

from tests.fixtures import client  # noqa: F401
from tests.fixtures import authenticated_client, some_user, user_data
from zulu import db_tools


@pytest.fixture(autouse=True)
def cleanup_db():
    db_tools.purge_db()
