const getHidePath = (urls: string[], key: string) => {
  return urls.indexOf(key) > -1;
};

export const getHideHeader = (url: string) => {
  return getHidePath(
    [
      '/',
      // '/star/upgrade',
      // '/star/grow',
      // '/star/embattle',
      // '/star/embattle-test',
      // '/star/search',
      '/upgrade-list',
      '/plunder-pk',
      '/galaxy/auction',
      '/BattleReport',
      '/vip',
      '/choose-planet',
      '/platform-News',
      '/mystery-box/state',
      '/explore-progress',
    ],
    url,
  );
};

export const getHideFooter = (url: string) => {
  return getHidePath(
    [
      '/star',
      '/star/upgrade',
      '/star/grow',
      '/star/embattle',
      '/star/embattle-test',
      '/mystery-box/state',
    ],
    url,
  );
};
