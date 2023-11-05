import { SystemDTO } from './system.dto';
import { Request } from 'express';
import { UserDTO } from './user.dto';

declare type Req = Request & { system?: SystemDTO; user?: UserDTO };
