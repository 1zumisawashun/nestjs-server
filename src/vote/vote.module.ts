import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  imports: [PrismaModule],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
