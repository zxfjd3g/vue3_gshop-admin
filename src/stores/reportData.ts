import { defineStore } from 'pinia'
import { reportDataApi } from '@/api/data'
import type { ReportDataModel } from '@/api/data/model'

export const useDataStore = defineStore({
  id: 'data',
  
  state () {
    return {
      reportData: {} as ReportDataModel
    }
  },
  
  actions: {
    async getData () {
      const reportData = await reportDataApi()
      this.reportData = reportData
    }
  }
})