from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.education import EducationProgram, StudentApplication
from app.schemas.education import (
    EducationProgramOut, EducationProgramCreate,
    StudentApplicationAdminOut, StudentApplicationStatusUpdate
)
from app.services.audit_service import log_action

router = APIRouter()

@router.get("/programs", response_model=List[EducationProgramOut])
async def list_programs(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(EducationProgram)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/programs", response_model=EducationProgramOut)
async def create_program(req: EducationProgramCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    prog = EducationProgram(
        title=req.title,
        target_exams=req.target_exams,
        description=req.description,
        is_open_for_applications=req.is_open_for_applications
    )
    db.add(prog)
    await db.commit()
    await db.refresh(prog)
    return prog

@router.get("/applications", response_model=List[StudentApplicationAdminOut])
async def list_applications(
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(StudentApplication).order_by(desc(StudentApplication.created_at))
    if status_filter:
        stmt = stmt.where(StudentApplication.status == status_filter)
    res = await db.execute(stmt)
    apps = res.scalars().all()

    results = []
    for a in apps:
        results.append(StudentApplicationAdminOut(
            id=a.id,
            program_title=a.program.title if a.program else "General Competitive Coaching Support",
            student_name=a.student_name,
            parent_guardian_name=a.parent_guardian_name,
            mobile=a.mobile,
            email=a.email,
            village_name=a.village_name,
            current_class_or_year=a.current_class_or_year,
            school_or_college=a.school_or_college,
            target_examination=a.target_examination,
            academic_performance=a.academic_performance,
            annual_family_income_range=a.annual_family_income_range,
            reason_for_support=a.reason_for_support,
            coaching_requirement=a.coaching_requirement,
            status=a.status,
            internal_review_notes=a.internal_review_notes,
            reviewed_by_name=None,
            documents=[],
            created_at=a.created_at
        ))
    return results

@router.patch("/applications/{id}/status")
async def update_application_status(
    id: UUID,
    req: StudentApplicationStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(StudentApplication).where(StudentApplication.id == id)
    res = await db.execute(stmt)
    app = res.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app.status
    app.status = req.status
    if req.internal_review_notes:
        app.internal_review_notes = req.internal_review_notes
    app.reviewed_by_user_id = current_user.id

    await log_action(
        db=db,
        action="STUDENT_APP_STATUS_CHANGE",
        entity="student_applications",
        entity_id=str(app.id),
        user_id=current_user.id,
        old_values={"status": old_status},
        new_values={"status": req.status}
    )

    await db.commit()
    return {"message": "Application status updated successfully", "status": app.status}
