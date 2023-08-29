import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private isInitialized = false;

  async onModuleInit() {
    if (!this.isInitialized) {
      await this.$connect();
      this.isInitialized = true;
    }
  }
}