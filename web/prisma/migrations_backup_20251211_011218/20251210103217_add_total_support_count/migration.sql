-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consultant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "specialties" TEXT,
    "experienceYears" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "headline" TEXT,
    "profileSummary" TEXT,
    "achievementsSummary" TEXT,
    "expertiseRoles" JSONB,
    "expertiseCompanyTypes" JSONB,
    "twitterUrl" TEXT,
    "linkedinUrl" TEXT,
    "schedulerUrl" TEXT,
    "thumbnailUrl" TEXT,
    "profileSourceRaw" TEXT,
    "totalSupportCount" INTEGER NOT NULL DEFAULT 0,
    "snsFollowersTwitter" INTEGER,
    "snsFollowersLinkedin" INTEGER,
    "snsFollowersInstagram" INTEGER,
    "externalLinks" JSONB,
    "timelexUrl" TEXT,
    "twitterHandle" TEXT,
    CONSTRAINT "Consultant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Consultant" ("achievementsSummary", "bio", "createdAt", "experienceYears", "expertiseCompanyTypes", "expertiseRoles", "externalLinks", "headline", "id", "linkedinUrl", "name", "profileSourceRaw", "profileSummary", "schedulerUrl", "snsFollowersInstagram", "snsFollowersLinkedin", "snsFollowersTwitter", "specialties", "thumbnailUrl", "timelexUrl", "twitterHandle", "twitterUrl", "userId") SELECT "achievementsSummary", "bio", "createdAt", "experienceYears", "expertiseCompanyTypes", "expertiseRoles", "externalLinks", "headline", "id", "linkedinUrl", "name", "profileSourceRaw", "profileSummary", "schedulerUrl", "snsFollowersInstagram", "snsFollowersLinkedin", "snsFollowersTwitter", "specialties", "thumbnailUrl", "timelexUrl", "twitterHandle", "twitterUrl", "userId" FROM "Consultant";
DROP TABLE "Consultant";
ALTER TABLE "new_Consultant" RENAME TO "Consultant";
CREATE UNIQUE INDEX "Consultant_userId_key" ON "Consultant"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
