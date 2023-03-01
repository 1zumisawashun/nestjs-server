/*
  Warnings:

  - You are about to drop the column `upvotes` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "Upvote" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UpvoteToVote" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UpvoteToVote_AB_unique" ON "_UpvoteToVote"("A", "B");

-- CreateIndex
CREATE INDEX "_UpvoteToVote_B_index" ON "_UpvoteToVote"("B");

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpvoteToVote" ADD CONSTRAINT "_UpvoteToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "Upvote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpvoteToVote" ADD CONSTRAINT "_UpvoteToVote_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
