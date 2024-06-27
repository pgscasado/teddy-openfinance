/*
  Warnings:

  - Added the required column `ipAddress` to the `UrlAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrer` to the `UrlAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `UrlAccess` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UrlAccess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "urlId" INTEGER NOT NULL,
    "accessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    CONSTRAINT "UrlAccess_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UrlAccess" ("id", "urlId") SELECT "id", "urlId" FROM "UrlAccess";
DROP TABLE "UrlAccess";
ALTER TABLE "new_UrlAccess" RENAME TO "UrlAccess";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
