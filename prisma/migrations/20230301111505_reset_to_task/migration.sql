/*
  Warnings:

  - You are about to drop the `Upvote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UpvoteToVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UpvoteToVote" DROP CONSTRAINT "_UpvoteToVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_UpvoteToVote" DROP CONSTRAINT "_UpvoteToVote_B_fkey";

-- DropTable
DROP TABLE "Upvote";

-- DropTable
DROP TABLE "Vote";

-- DropTable
DROP TABLE "_UpvoteToVote";
