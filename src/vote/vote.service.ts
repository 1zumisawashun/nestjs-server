import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Vote } from '@prisma/client';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  getVotes(userId: number): Promise<Vote[]> {
    return this.prisma.vote.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createVote(userId: number, dto: CreateVoteDto): Promise<Vote> {
    const vote = await this.prisma.vote.create({
      data: {
        ...dto,
        userId,
      },
    });
    return vote;
  }

  async updateVoteById(userId: number, voteId: number): Promise<Vote> {
    const vote = await this.prisma.vote.findUnique({
      where: {
        id: voteId,
      },
      include: {
        upvotes: true, // All posts where authorId == 20
      },
    });
    console.log(vote, 'voteids');

    const voteIds = vote.upvotes.map((val) => val.userId);
    const isVoted = voteIds.includes(userId);

    if (!vote || isVoted)
      throw new ForbiddenException('No permission to update, because one time');

    await this.prisma.upvote.create({
      data: {
        voteId,
        userId,
        count: voteIds.length + 1, // これいらないかも
      },
    });

    return vote;
  }
}
