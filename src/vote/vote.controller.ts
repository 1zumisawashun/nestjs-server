import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}
  @Get()
  getTasks(@Req() req: Request): Promise<Vote[]> {
    return this.voteService.getVotes(req.user.id);
  }

  @Post()
  createTask(@Req() req: Request, @Body() dto: CreateVoteDto): Promise<Vote> {
    return this.voteService.createVote(req.user.id, dto);
  }

  @Patch(':id')
  updateTaskById(
    @Req() req: Request, // next()の値？
    @Param('id', ParseIntPipe) voteId: number, //動的な部分を受け取れる、parseIntPipeでnumberに変換してくれる。これありがたい！
  ): Promise<Vote> {
    return this.voteService.updateVoteById(req.user.id, voteId);
  }
}
