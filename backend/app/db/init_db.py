import asyncio
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import AsyncSessionLocal, engine
from app.db.base import Base
from app.models.rbac import Role, Permission
from app.models.user import User
from app.models.committee import Designation, CommitteeMember
from app.models.event import Event, EventProgram
from app.models.announcement import Announcement, Poster
from app.models.donation import Donor, Donation
from app.models.expense import ExpenseCategory, Expense
from app.models.education import EducationProgram
from app.models.settings import SiteSetting
from app.services.donation_service import donation_service

async def init_db():
    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # 1. Check if Super Admin exists
        stmt = select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL)
        res = await db.execute(stmt)
        superuser = res.scalar_one_or_none()

        if not superuser:
            print("--- Seeding Initial Database Records ---")
            # 1. Roles
            super_role = Role(name="SUPER_ADMIN", description="पूर्ण प्रशासनिक नियंत्रण (Full System Access)", is_system=True)
            finance_role = Role(name="FINANCE_ADMIN", description="दान एवं व्यय प्रबंधक (Finance & Donation Manager)", is_system=True)
            event_role = Role(name="EVENT_ADMIN", description="कार्यक्रम एवं प्रचार प्रबंधक (Event & Content Manager)", is_system=True)
            db.add_all([super_role, finance_role, event_role])
            await db.flush()

            # 2. Super User
            superuser = User(
                username="superadmin",
                email=settings.FIRST_SUPERUSER_EMAIL,
                mobile="9876543210",
                full_name=settings.FIRST_SUPERUSER_NAME,
                password_hash=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                is_active=True,
                roles=[super_role]
            )
            db.add(superuser)

            # 3. Designations
            desig_data = [
                ("अध्यक्ष", "President", 1),
                ("उपाध्यक्ष", "Vice President", 2),
                ("सचिव", "General Secretary", 3),
                ("सह-सचिव", "Joint Secretary", 4),
                ("कोषाध्यक्ष", "Treasurer", 5),
                ("सह-कोषाध्यक्ष", "Joint Treasurer", 6),
                ("कार्यक्रम संयोजक", "Event Coordinator", 7),
                ("मीडिया एवं प्रचार प्रभारी", "Media & IT Incharge", 8),
                ("वरिष्ठ मार्गदर्शक", "Chief Patron / Mentor", 9),
                ("कार्यकारिणी सदस्य", "Executive Member", 10),
            ]
            designations = []
            for hi, en, order in desig_data:
                d = Designation(title_hi=hi, title_en=en, display_order=order)
                db.add(d)
                designations.append(d)
            await db.flush()

            # 4. Committee Members
            members_seed = [
                ("राजेश", "9023970783", "rajesh@pothipurayouth.org", designations[0], 1, "पोथीपुरा युवा समिति के सक्रिय सदस्य, ग्राम विकास एवं सांस्कृतिक आयोजनों के मुख्य सूत्रधार।"),
                ("आकाश", "9829012345", "aakash@pothipurayouth.org", designations[1], 2, "सामाजिक सरोकारों में अग्रणी, ग्राम सुरक्षा एवं खेलकूद गतिविधियों के संयोजक।"),
                ("नरेश", "9829023456", "naresh@pothipurayouth.org", designations[2], 3, "समिति के संगठनात्मक कार्यों व जनसंपर्क के मुख्य संचालक।"),
                ("तिलक", "9829034567", "tilak@pothipurayouth.org", designations[4], 4, "समिति का वित्तीय प्रबंधन एवं संपूर्ण दान/व्यय पारदर्शिता के उत्तरदायी।"),
            ]
            comm_members = []
            for name, mob, em, desig, order, bio in members_seed:
                cm = CommitteeMember(
                    full_name=name,
                    mobile=mob,
                    email=em,
                    designation_id=desig.id,
                    display_order=order,
                    bio=bio,
                    joining_date=date(2020, 1, 1),
                    is_active=True
                )
                db.add(cm)
                comm_members.append(cm)
            await db.flush()

            # 5. Janmashtami 2026 Event
            janmashtami_event = Event(
                slug="janmashtami-2026",
                title_hi="श्री कृष्ण जन्माष्टमी महोत्सव 2026",
                title_en="Shree Krishna Janmashtami Mahotsav 2026",
                event_type="RELIGIOUS",
                description_hi="समस्त पोथीपुरा ग्रामवासियों एवं युवा शक्ति के सहयोग से 4 सितम्बर को भव्य श्री कृष्ण जन्माष्टमी महोत्सव, भजन संध्या, मटकी फोड़ प्रतियोगिता एवं महाप्रसाद का विराट आयोजन।",
                description_en="Grand celebration of Krishna Janmashtami on 4 September featuring Bhajan Sandhya, Matki Phod, cultural dramas, and Mahaprasad.",
                start_date=datetime(2026, 9, 4, 6, 0, 0),
                end_date=datetime(2026, 9, 5, 2, 0, 0),
                venue="श्री राधा कृष्ण मंदिर, पोथी का नगला (पोथीपुरा)",
                target_donation_amount=Decimal("500000.00"),
                status="UPCOMING",
                is_featured=True
            )
            db.add(janmashtami_event)
            await db.flush()

            # Programs
            programs_data = [
                ("06:00 AM", "प्रभात फेरी एवं संकीर्तन", "Morning Prabhat Pheri & Temple Chanting", "ग्राम के प्रमुख मार्गों से श्री कृष्ण संकीर्तन प्रभात फेरी।", 1),
                ("09:00 AM", "विशेष अभिषेक एवं शृंगार", "Special Abhishek & Temple Decoration", "पंचामृत अभिषेक एवं भगवान श्री कृष्ण का दिव्य अलौकिक शृंगार।", 2),
                ("04:00 PM", "बाल कृष्ण रूप सज्जा प्रतियोगिता", "Kids Radha-Krishna Fancy Dress Competition", "ग्राम के नन्हे-मुन्ने बच्चों द्वारा मनमोहक राधा-कृष्ण रूप सज्जा।", 3),
                ("07:00 PM", "भव्य भजन संध्या एवं झांकी दर्शन", "Grand Bhajan Sandhya & Cultural Tableaux", "प्रसिद्ध भजन गायकों द्वारा सुमधुर श्याम भजनों की रसधार।", 4),
                ("10:30 PM", "रोमांचक मटकी फोड़ प्रतियोगिता", "Thrilling Matki Phod Competition", "ग्राम की युवा मंडलियों द्वारा 25 फीट ऊंची मटकी फोड़ स्पर्धा।", 5),
                ("12:00 AM", "श्री कृष्ण जन्मोत्सव, महा-आरती एवं छप्पन भोग", "Krishna Janma Midnight Celebration & Maha-Aarti", "मध्यरात्रि में भगवान का प्राकट्योत्सव, 108 दीपों की महा-आरती एवं छप्पन भोग महाप्रसाद वितरण।", 6),
            ]
            for time_lbl, t_hi, t_en, desc, order in programs_data:
                db.add(EventProgram(
                    event_id=janmashtami_event.id,
                    time_label=time_lbl,
                    title_hi=t_hi,
                    title_en=t_en,
                    description=desc,
                    display_order=order
                ))

            # 6. Announcements
            announcements_data = [
                (
                    "जन्माष्टमी महोत्सव की तैयारियां पूर्ण, सभी ग्रामवासी सादर आमंत्रित",
                    "Janmashtami Preparations Complete, All Villagers Cordially Invited",
                    "4 सितम्बर को होने वाले भव्य कृष्ण जन्मोत्सव हेतु मंदिर प्रांगण में विशेष वाटरप्रूफ टेंट, लाइटिंग एवं बैठने की उत्तम व्यवस्था की गई है।",
                    "Special arrangements including waterproof tents, illuminated lighting, and seating have been completed.",
                    "CRITICAL"
                ),
                (
                    "बाल कृष्ण रूप सज्जा प्रतियोगिता हेतु निशुल्क पंजीयन शुरू",
                    "Free Registration Open for Kids Fancy Dress",
                    "0 से 10 वर्ष तक के बच्चों के लिए राधा-कृष्ण रूप सज्जा प्रतियोगिता हेतु अपना नाम 3 सितम्बर तक समिति कार्यालय में दर्ज कराएं।",
                    "Register your child for Radha Krishna competition before 3rd September.",
                    "HIGH"
                ),
                (
                    "महाप्रसाद एवं भंडारा सहयोग राशि आमंत्रण",
                    "Invitation for Mahaprasad & Bhandara Donations",
                    "छप्पन भोग महाप्रसाद एवं भंडारे हेतु स्वैच्छिक आर्थिक सहयोग ऑनलाइन UPI या समिति सदस्यों के माध्यम से जमा कराएं।",
                    "Voluntary contributions for Mahaprasad can be made via UPI or committee members.",
                    "NORMAL"
                )
            ]
            for a_hi, a_en, d_hi, d_en, pri in announcements_data:
                db.add(Announcement(
                    event_id=janmashtami_event.id,
                    title_hi=a_hi,
                    title_en=a_en,
                    description_hi=d_hi,
                    description_en=d_en,
                    priority=pri,
                    is_published=True
                ))

            # 7. Expense Categories
            cat_names = [
                ("सजावट व पुष्प शृंगार", "Decoration & Floral"),
                ("प्रसाद व भंडारा व्यवस्था", "Prasad & Community Feast"),
                ("साउंड व डिजिटल लाइटिंग", "Sound & Stage Lighting"),
                ("टेंट, मंच व बैरिकेडिंग", "Tent, Stage & Barricading"),
                ("विद्युत व जनरेटर व्यवस्था", "Electricity & Backup Generator"),
                ("छपाई, पोस्टर व प्रचार", "Printing, Posters & Promotion"),
                ("पूजन व धार्मिक सामग्री", "Puja & Ritual Items"),
                ("स्वयंसेवक व सुरक्षा", "Volunteer & Security"),
                ("शिक्षा सहयोग निधि", "Education Support Fund"),
                ("विविध व्यय", "Miscellaneous")
            ]
            expense_categories = []
            for hi, en in cat_names:
                c = ExpenseCategory(name_hi=hi, name_en=en, is_active=True)
                db.add(c)
                expense_categories.append(c)
            await db.flush()

            # 8. Initial Verified Sample Donations (To give life to transparency meter)
            donors_data = [
                ("चौधरी हनुमान राम जी", "9828011111", 51000.0, "JANMASHTAMI", False),
                ("सेठ बंशीधर अग्रवाल", "9828022222", 31000.0, "JANMASHTAMI", False),
                ("गुप्त दानदाता (श्री श्याम भक्त)", "9828033333", 21000.0, "JANMASHTAMI", True),
                ("ठाकुर भवानी सिंह", "9828044444", 25000.0, "JANMASHTAMI", False),
                ("मास्टर जगदीश प्रसाद शर्मा", "9828055555", 11000.0, "EDUCATION", False),
                ("ग्राम युवा प्रवासी मंडल (सूरत)", "9828066666", 51000.0, "JANMASHTAMI", False),
                ("कैलाश चन्द कुमावत", "9828077777", 15000.0, "JANMASHTAMI", False),
                ("गुप्त दानदाता", "9828088888", 5100.0, "COMMUNITY", True),
                ("दिनेश कुमार टेलर", "9828099999", 11000.0, "JANMASHTAMI", False),
                ("महेन्द्र सिंह राठौड़", "9828000000", 21000.0, "JANMASHTAMI", False)
            ]
            for d_name, d_mob, d_amt, d_purp, is_anon in donors_data:
                donor = Donor(
                    full_name=d_name,
                    mobile=d_mob,
                    is_anonymous_by_default=is_anon
                )
                db.add(donor)
                await db.flush()

                don = Donation(
                    donor_id=donor.id,
                    event_id=janmashtami_event.id,
                    amount=Decimal(str(d_amt)),
                    purpose=d_purp,
                    payment_method="UPI_ONLINE" if not is_anon else "CASH",
                    transaction_ref=f"UTR{datetime.utcnow().strftime('%m%d%H%M')}{d_mob[-4:]}",
                    status="VERIFIED",
                    is_anonymous=is_anon,
                    verified_by_user_id=superuser.id,
                    verified_at=datetime.utcnow()
                )
                db.add(don)
                await db.flush()

                # Generate Official Receipt
                await donation_service.create_receipt_for_donation(db, don)

            # 9. Initial Approved Expenses
            expenses_seed = [
                (expense_categories[0], 35000.0, "मंदिर प्रांगण व मुख्य द्वार पर भव्य फूलों एवं गुब्बारों का शृंगार", comm_members[4], "श्री श्याम फ्लोरिस्ट", "CASH"),
                (expense_categories[2], 28000.0, "साउंड सिस्टम, डिजिटल एल.ई.डी. वॉल एवं मुख्य स्टेज लाइटिंग अग्रिम", comm_members[3], "रॉयल साउंड एंड डीजे", "UPI"),
                (expense_categories[3], 42000.0, "वाटरप्रूफ जर्मन हैंगर टेंट, कालीन व 1000 कुर्सियों की व्यवस्था", comm_members[0], "बालाजी टेंट हाउस", "BANK_TRANSFER"),
                (expense_categories[6], 12500.0, "पूजा सामग्री, पंचामृत, हवन सामग्री व 108 दीपक", comm_members[4], "श्री कृष्ण पूजन भंडार", "CASH"),
                (expense_categories[5], 6500.0, "महोत्सव आमंत्रण पत्रिका, बैनर एवं 20 बड़े होर्डिंग्स छपाई", comm_members[5], "महालक्ष्मी प्रिंटर्स", "UPI")
            ]
            for cat, amt, desc, member, vendor, pay_m in expenses_seed:
                db.add(Expense(
                    event_id=janmashtami_event.id,
                    category_id=cat.id,
                    amount=Decimal(str(amt)),
                    description=desc,
                    committee_member_id=member.id,
                    vendor_name=vendor,
                    payment_method=pay_m,
                    expense_date=date.today(),
                    status="APPROVED",
                    created_by_user_id=superuser.id,
                    approved_by_user_id=superuser.id,
                    is_public_disclosed=True
                ))

            # 10. Education Support Initiative
            edu_prog = EducationProgram(
                title="ग्रामीण मेधावी प्रतिभा प्रोत्साहन एवं प्रतियोगी परीक्षा मार्गदर्शन योजना",
                target_exams=["IIT-JEE", "NEET", "UPSC", "SSC", "NDA", "Banking"],
                description="आर्थिक रूप से कमजोर ग्रामीण प्रतिभावान छात्र-छात्राओं को कोटा / सीकर / जयपुर की प्रतिष्ठित कोचिंग संस्थानों में प्रवेश, छात्रवृत्ति, पाठ्य सामग्री एवं ऑनलाइन टेस्ट सीरीज हेतु आर्थिक सहायता।",
                is_open_for_applications=True
            )
            db.add(edu_prog)

            # 11. Site Settings (UPI)
            db.add(SiteSetting(
                key="upi_settings",
                value={
                    "upi_id": "youthcommittee@upi",
                    "payee_name": "Gram Yuva Samiti",
                    "donation_note": "Shree Krishna Janmashtami Mahotsav 2026"
                },
                description="UPI Payment ID and Payee Information",
                updated_by_user_id=superuser.id
            ))

            await db.commit()
            print("--- Database Initialized & Seeded Successfully! ---")
            print(f"Super Admin Login: {settings.FIRST_SUPERUSER_EMAIL} / {settings.FIRST_SUPERUSER_PASSWORD}")

if __name__ == "__main__":
    asyncio.run(init_db())
