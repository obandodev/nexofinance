"""add status to savings goals and contributions

Revision ID: dc93e1b691c3
Revises: abdebe29a63d
Create Date: 2026-08-11 21:28:58.326560

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'dc93e1b691c3'
down_revision: Union[str, None] = 'abdebe29a63d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'savings_contributions',
        sa.Column(
            'status',
            sa.String(),
            nullable=False,
            server_default='ACTIVE',
        ),
    )

    op.add_column(
        'savings_goals',
        sa.Column(
            'status',
            sa.String(),
            nullable=False,
            server_default='ACTIVE',
        ),
    )

    op.alter_column(
        'savings_contributions',
        'status',
        server_default=None,
    )

    op.alter_column(
        'savings_goals',
        'status',
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column('savings_goals', 'status')
    op.drop_column('savings_contributions', 'status')