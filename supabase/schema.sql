CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "Teacher" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "teacherId" VARCHAR(255) UNIQUE NOT NULL,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  certificate TEXT,
  dob DATE NOT NULL,
  photo TEXT,
  address TEXT NOT NULL,
  phone VARCHAR(255),
  "hireDate" TIMESTAMP DEFAULT NOW(),
  "employmentType" VARCHAR(50) NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "User" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  "teacherId" UUID REFERENCES "Teacher"(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Halaqa" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  "studentLevel" VARCHAR(255),
  "isActive" BOOLEAN DEFAULT true,
  "teacherId" UUID NOT NULL REFERENCES "Teacher"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Student" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "studentId" VARCHAR(255) UNIQUE NOT NULL,
  "firstName" VARCHAR(255) NOT NULL,
  "fatherName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  address TEXT NOT NULL,
  gender VARCHAR(50) NOT NULL,
  "registrationDate" TIMESTAMP DEFAULT NOW(),
  phone VARCHAR(255),
  "guardianPhone" VARCHAR(255),
  photo TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "halaqaId" UUID REFERENCES "Halaqa"(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Transaction" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date TIMESTAMP DEFAULT NOW(),
  "photoUrl" TEXT,
  "studentId" UUID REFERENCES "Student"(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "LearningRecord" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "weekStartDate" DATE NOT NULL,
  attendance INTEGER DEFAULT 0,
  surah VARCHAR(255),
  "dailyDars" VARCHAR(255),
  "memorizedDays" INTEGER DEFAULT 0,
  "notMemorizedDays" INTEGER DEFAULT 0,
  "rubuAmount" DECIMAL(10, 2) DEFAULT 0,
  "murajaaFrom" VARCHAR(255),
  "murajaaTo" VARCHAR(255),
  "murajaaDays" INTEGER DEFAULT 0,
  "murajaaNotDays" INTEGER DEFAULT 0,
  notes TEXT,
  "studentId" UUID NOT NULL REFERENCES "Student"(id) ON DELETE CASCADE,
  "teacherId" UUID NOT NULL REFERENCES "Teacher"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("studentId", "weekStartDate")
);

CREATE TABLE IF NOT EXISTS "Report" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  "teacherId" UUID NOT NULL REFERENCES "Teacher"(id) ON DELETE CASCADE,
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_username ON "User"(username);
CREATE INDEX IF NOT EXISTS idx_user_teacherId ON "User"("teacherId");
CREATE INDEX IF NOT EXISTS idx_student_studentId ON "Student"("studentId");
CREATE INDEX IF NOT EXISTS idx_student_halaqaId ON "Student"("halaqaId");
CREATE INDEX IF NOT EXISTS idx_student_registrationDate ON "Student"("registrationDate");
CREATE INDEX IF NOT EXISTS idx_teacher_teacherId ON "Teacher"("teacherId");
CREATE INDEX IF NOT EXISTS idx_teacher_hireDate ON "Teacher"("hireDate");
CREATE INDEX IF NOT EXISTS idx_halaqa_teacherId ON "Halaqa"("teacherId");
CREATE INDEX IF NOT EXISTS idx_transaction_studentId ON "Transaction"("studentId");
CREATE INDEX IF NOT EXISTS idx_learning_record_studentId ON "LearningRecord"("studentId");
CREATE INDEX IF NOT EXISTS idx_learning_record_teacherId ON "LearningRecord"("teacherId");
CREATE INDEX IF NOT EXISTS idx_report_teacherId ON "Report"("teacherId");

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
DROP TRIGGER IF EXISTS update_teacher_updated_at ON "Teacher";
DROP TRIGGER IF EXISTS update_halaqa_updated_at ON "Halaqa";
DROP TRIGGER IF EXISTS update_student_updated_at ON "Student";
DROP TRIGGER IF EXISTS update_transaction_updated_at ON "Transaction";
DROP TRIGGER IF EXISTS update_learning_record_updated_at ON "LearningRecord";
DROP TRIGGER IF EXISTS update_report_updated_at ON "Report";

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_updated_at BEFORE UPDATE ON "Teacher" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_halaqa_updated_at BEFORE UPDATE ON "Halaqa" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_updated_at BEFORE UPDATE ON "Student" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transaction_updated_at BEFORE UPDATE ON "Transaction" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_record_updated_at BEFORE UPDATE ON "LearningRecord" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_report_updated_at BEFORE UPDATE ON "Report" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
