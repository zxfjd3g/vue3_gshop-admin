export interface ReportDataModel {
  // 今日销售额
  salesToday?: number;
  salesLastDay?: number;
  salesGrowthLastDay?: number;
  salesGrowthLastMonth?: number;

  // 今日订单量
  orderToday?: number;
  orderLastDay?: number;
  orderTrend?: number[];
  orderTrendAxis?: string[];

  // 今日交易用户数
  orderUser?: number;
  returnRate?: number;
  orderUserTrend?: number[];
  orderUserTrendAxis?: string[];

  // 累计用户数
  usersTotal?: number;
  usersLastMonth?: number;
  userGrowthLastDay?: string;
  userGrowthLastMonth?: string;

  // 销售额与访问量
  orderFullYearAxis?: string[];
  orderFullYear?: number[];
  userFullYearAxis?: string[];
  userFullYear?: number[];

  // 排行榜
  orderRank?: Array<{no: number, name: string, count: string}>;
  userRank?: Array<{no: number, name: string, count: string}>;

  // 关键字搜索
  searchWord?: Array<{word: string, count: number, user: number}>

  // 分类销售排行
  saleRank?: {
    category: {
      axisX: string[],
      data1: number[]
    },
    goods: {
      axisX: string[],
      data1: number[]
    }
  }
}