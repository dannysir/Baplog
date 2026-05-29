import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// $connect는 첫 쿼리에서 자동 호출되도록 lazy로 둔다.
// DB 미가용 상태에서도 부팅이 끊기지 않게 하기 위함(/health 등 무관 라우트 보호).
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
