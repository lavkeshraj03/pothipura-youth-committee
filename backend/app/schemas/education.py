from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, EmailStr

class EducationProgramBase(BaseModel):
    title: str
    target_exams: List[str] = ["IIT-JEE", "NEET", "UPSC", "SSC"]
    description: str
    is_open_for_applications: bool = True

class EducationProgramCreate(EducationProgramBase):
    pass

class EducationProgramOut(EducationProgramBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class StudentDocumentOut(BaseModel):
    id: UUID
    doc_type: str
    file_url: str
    uploaded_at: datetime
    class Config:
        from_attributes = True

class StudentApplicationCreate(BaseModel):
    program_id: Optional[int] = None
    student_name: str
    parent_guardian_name: str
    mobile: str
    email: Optional[EmailStr] = None
    village_name: str
    current_class_or_year: str
    school_or_college: str
    target_examination: str
    academic_performance: str
    annual_family_income_range: str
    reason_for_support: str
    coaching_requirement: str

class StudentApplicationAdminOut(BaseModel):
    id: UUID
    program_title: Optional[str] = None
    student_name: str
    parent_guardian_name: str
    mobile: str
    email: Optional[str] = None
    village_name: str
    current_class_or_year: str
    school_or_college: str
    target_examination: str
    academic_performance: str
    annual_family_income_range: str
    reason_for_support: str
    coaching_requirement: str
    status: str
    internal_review_notes: Optional[str] = None
    reviewed_by_name: Optional[str] = None
    documents: List[StudentDocumentOut] = []
    created_at: datetime
    class Config:
        from_attributes = True

class StudentApplicationStatusUpdate(BaseModel):
    status: str  # SUBMITTED, UNDER_REVIEW, SHORTLISTED, APPROVED, REJECTED
    internal_review_notes: Optional[str] = None
