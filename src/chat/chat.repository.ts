import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatDataDTO } from './chat.dto';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(@InjectRepository(Chat) repository: Repository<Chat>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async getChatData(
    olderThan: Date = new Date(),
  ): Promise<ChatDataDTO[]> {
    const query = `
        SELECT jsonb_agg(u.*) AS            "participants",
               (SELECT jsonb_build_object(
                               'id', m.id,
                               'timestamp', m.timestamp,
                               'content', m.content,
                               'fromId', m."fromId"
                           )
                FROM message m
                WHERE m."chatId" = "c"."id"
                GROUP BY m."id", m."timestamp"
                ORDER BY m."timestamp" DESC LIMIT 1) AS "lastMessage",
               (SELECT COUNT(DISTINCT id) FROM "message" WHERE "timestamp" <= $1)::int AS "unreadMessageCount"
        FROM chat c
            LEFT JOIN chat_interaction ci
        ON ci."chatId" = c.id
            LEFT JOIN "user" u ON ci."userId" = u.id
            INNER JOIN "message" m2 ON m2."chatId" = c."id"
        GROUP BY c.id;
    `;

    return this.query(query, [olderThan]);
  }
}
