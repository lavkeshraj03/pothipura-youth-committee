from datetime import datetime
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class EducationProgram(Base):
    __tablename__ = "education_programs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    target_exams = Column(JSON, default=["IIT-JEE", "NEET", "UPSC", "SSC"])
    description = Column(Text, nullable=False)
    is_open_for_applications = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("StudentApplication", back_populates="program")

class StudentApplication(Base):
    __tablename__ = "student_applications"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    program_id = Column(Integer, ForeignKey("education_programs.id", ondelete="RESTRICT"), nullable=True)
    student_name = Column(String(100), nullable=False)
    parent_guardian_name = Column(String(100), nullable=False)
    mobile = Column(String(15), nullable=False)
    email = Column(String(100), nullable=True)
    village_name = Column(String(100), nullable=False)
    current_class_or_year = Column(String(50), nullable=False)
    school_or_college = Column(String(150), nullable=False)
    target_examination = Column(String(50), nullable=False)
    academic_performance = Column(Text, nullable=False)
    annual_family_income_range = Column(String(50), nullable=False)
    reason_for_support = Column(Text, nullable=False)
    coaching_requirement = Column(Text, nullable=False)
    status = Column(String(30), default="SUBMITTED")  # SUBMITTED, UNDER_REVIEW, SHORTLISTED, APPROVED, REJECTED
    internal_review_notes = Column(Text, nullable=True)
    reviewed_by_user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    program = relationship("EducationProgram", back_populates="applications", lazy="selectin")
    documents = relationship("StudentDocument", back_populates="application", cascade="all, delete-orphan", lazy="selectin")

class StudentDocument(Base):
    __tablename__ = "student_documents"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    application_id = Column(GUID, ForeignKey("student_applications.id", ondelete="CASCADE"), nullable=False)
    doc_type = Column(String(50), nullable=False)  # MARKSHEET, INCOME_CERTIFICATE, AADHAAR
    file_path = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("StudentApplication", back_populates="documents")
