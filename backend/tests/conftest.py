import pytest

from tests.fixtures import user_data  # noqa: F401
from tests.fixtures import authenticated_client, client, some_user
from zulu import db_tools


@pytest.fixture(scope='session', autouse=True)
def setup_db():
    db_tools.init_db()


@pytest.fixture(autouse=True)
def cleanup_db():
    db_tools.purge_db()
