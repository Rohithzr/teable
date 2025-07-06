import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const SHARE_VIEW_EXPORT = '/share/{shareId}/export';

export const ShareViewExportRoute: RouteConfig = registerRoute({
  method: 'get',
  path: SHARE_VIEW_EXPORT,
  description: 'export share view records as csv',
  request: {
    params: z.object({
      shareId: z.string(),
    }),
    query: z.object({
      viewId: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: 'csv content',
    },
  },
  tags: ['share'],
});

export const exportShareViewCsv = async (shareId: string, viewId?: string) => {
  return axios.get(urlBuilder(SHARE_VIEW_EXPORT, { shareId }), {
    params: { viewId },
  });
};
