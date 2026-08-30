from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.my_world_item import MyWorldItem
from app.schemas.my_world import (
    MyWorldInteractionReport,
    MyWorldItemCreate,
    MyWorldItemResponse,
)
# from app.auth.dependencies import get_patient_for_auth, require_roles
from app.core.deps import (
    AuthContext,
    get_patient_for_auth,
    require_roles,
)


router = APIRouter(
    prefix="/my-world",
    tags=["My World"],
)


@router.get(
    "/{patient_id}",
    response_model=list[MyWorldItemResponse],
)
def get_my_world(
    patient_id: UUID,
    auth=Depends(require_roles("caregiver", "patient")),
    db: Session = Depends(get_db),
):
    patient = get_patient_for_auth(patient_id, auth, db)

    return (
        db.query(MyWorldItem)
        .filter(MyWorldItem.patient_id == patient.id)
        .all()
    )


@router.post(
    "/{patient_id}",
    response_model=MyWorldItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_my_world_item(
    patient_id: UUID,
    item_data: MyWorldItemCreate,
    auth=Depends(require_roles("caregiver")),
    db: Session = Depends(get_db),
):
    patient = get_patient_for_auth(patient_id, auth, db)

    item = MyWorldItem(
        patient_id=patient.id,
        category=item_data.category,
        name=item_data.name,
        relationship=item_data.relationship,
        description=item_data.description,
        photo_uri=item_data.photo_uri,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/{patient_id}/{item_id}",
    response_model=MyWorldItemResponse,
)
def update_my_world_item(
    patient_id: UUID,
    item_id: UUID,
    item_data: MyWorldItemCreate,
    auth=Depends(require_roles("caregiver")),
    db: Session = Depends(get_db),
):
    patient = get_patient_for_auth(patient_id, auth, db)

    item = (
        db.query(MyWorldItem)
        .filter(
            MyWorldItem.id == item_id,
            MyWorldItem.patient_id == patient.id,
        )
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="My World item not found",
        )

    item.category = item_data.category
    item.name = item_data.name
    item.relationship = item_data.relationship
    item.description = item_data.description
    item.photo_uri = item_data.photo_uri

    db.commit()
    db.refresh(item)

    return item


@router.delete(
    "/{patient_id}/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_my_world_item(
    patient_id: UUID,
    item_id: UUID,
    auth=Depends(require_roles("caregiver")),
    db: Session = Depends(get_db),
):
    patient = get_patient_for_auth(patient_id, auth, db)

    item = (
        db.query(MyWorldItem)
        .filter(
            MyWorldItem.id == item_id,
            MyWorldItem.patient_id == patient.id,
        )
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="My World item not found",
        )

    db.delete(item)
    db.commit()


@router.post(
    "/{patient_id}/{item_id}/interaction",
    response_model=MyWorldItemResponse,
)
def report_my_world_interaction(
    patient_id: UUID,
    item_id: UUID,
    report: MyWorldInteractionReport,
    auth=Depends(require_roles("caregiver", "patient")),
    db: Session = Depends(get_db),
):
    patient = get_patient_for_auth(patient_id, auth, db)

    item = (
        db.query(MyWorldItem)
        .filter(
            MyWorldItem.id == item_id,
            MyWorldItem.patient_id == patient.id,
        )
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="My World item not found",
        )

    item.times_shown += 1

    correct = 1.0 if report.was_correct else 0.0

    old_rate = item.success_rate if item.success_rate is not None else 0.5

    item.success_rate = (
        old_rate
        + (correct - old_rate) / item.times_shown
    )

    item.last_shown_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(item)

    return item