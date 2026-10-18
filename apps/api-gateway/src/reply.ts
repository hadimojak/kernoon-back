import { Response } from 'express';
import { ServiceResult } from '@app/common';

export async function reply(res: Response, pending: Promise<ServiceResult>) {
  const result = await pending;
  res.status(result.status);
  return result.data;
}
