import request from '@/utils/request-data'
import type { ReportDataModel } from './model'

export const reportDataApi = () => request.get<any, ReportDataModel>('/report/data')