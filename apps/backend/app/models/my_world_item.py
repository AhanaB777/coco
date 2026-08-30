from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.enums import MyWorldCategory


class MyWorldItem(Base):
    __tablename__ = "my_world_items"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    patient_id: Mapped[UUID] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
        index=True,
    )

    category: Mapped[MyWorldCategory] = mapped_column(
        Enum(
            MyWorldCategory,
            values_callable=lambda e: [x.value for x in e],
            name="myworldcategory",
        ),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    relationship: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    photo_uri: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    success_rate: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
        default=None,
    )

    times_shown: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    last_shown_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )