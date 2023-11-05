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
    userId: string,
    unreadOnly = false,
  ): Promise<ChatDataDTO[]> {
    const query = `
        WITH cids AS (SELECT ci."chatId" AS id, ci."lastInteraction"
                      FROM chat_interaction ci
                      WHERE ci."userId" = $1),
             countids AS (SELECT count(distinct m.id)::int AS count, m."chatId" AS "chatId"
                          FROM message m
                                   INNER JOIN cids ON m."chatId" = cids.id
                          WHERE m."fromId" <> $1
                            AND m.timestamp >= cids."lastInteraction"
                          GROUP BY m."chatId")
        SELECT c.id,
               jsonb_agg(u.*) AS "participants",
               c2.count       AS "unreadMessageCount",
               (SELECT jsonb_build_object(
                               'id', m.id, 'timestamp', m.timestamp::timestamp WITH TIME ZONE, 'content', m.content,
                               'fromId', m."fromId", 'audioClip', ac."id", 'audioClipLength', ac."length"
                       )
                FROM message m
                         LEFT JOIN "audio_clip" ac ON ac."messageId" = m.id
                WHERE m."chatId" = "c"."id"
                GROUP BY m."id", m."timestamp", ac."id"
                ORDER BY m."timestamp" DESC
                LIMIT 1)      AS "lastMessage"
        FROM chat c
                 INNER JOIN public.chat_interaction i on c.id = i."chatId"
                 INNER JOIN cids ON cids.id = c.id
                 LEFT JOIN public."user" u on u.id = i."userId"
                 LEFT JOIN countids c2 ON c2."chatId" = c.id
        WHERE (CASE
                   WHEN $2 THEN
                       c2.count > 0
                   ELSE TRUE
            END)
        GROUP BY c.id, c2.count
        ORDER BY c."updatedAt" DESC
        LIMIT 10;
    `;

    return this.query(query, [userId, unreadOnly]);
  }
}
