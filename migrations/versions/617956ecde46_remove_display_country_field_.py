"""remove display_country field, unnecessary overhead for leaderboards

Revision ID: 617956ecde46
Revises: 949841325e7a
Create Date: 2024-06-07 23:36:37.581100

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '617956ecde46'
down_revision = '949841325e7a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('display_country')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('display_country', sa.BOOLEAN(), nullable=True))

    # ### end Alembic commands ###
