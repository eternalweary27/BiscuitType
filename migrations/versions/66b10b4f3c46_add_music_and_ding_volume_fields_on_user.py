"""add music and ding volume fields on user

Revision ID: 66b10b4f3c46
Revises: 617956ecde46
Create Date: 2024-06-08 16:43:04.637469

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '66b10b4f3c46'
down_revision = '617956ecde46'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('music_volume', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('ding_volume', sa.Float(), nullable=True))
        batch_op.drop_column('music_muted')
        batch_op.drop_column('ding_muted')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ding_muted', sa.BOOLEAN(), nullable=True))
        batch_op.add_column(sa.Column('music_muted', sa.BOOLEAN(), nullable=True))
        batch_op.drop_column('ding_volume')
        batch_op.drop_column('music_volume')

    # ### end Alembic commands ###
