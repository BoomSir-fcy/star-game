declare namespace Api {
  namespace Planet {
    // 我的星球分页参数
    interface PageParams {
      page: number;
      page_size: number;
    }
    interface Strengthen {
      PlanetID: number;
    }
    interface StrengthenPost {
      planet_id: number;
    }
  }
}
