import Mock from 'mockjs'
import data from './data.json'

Mock.mock('/mock/report/data', {
  code: 2000,
  data
})
