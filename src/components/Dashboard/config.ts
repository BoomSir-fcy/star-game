const getHidePath = (urls: string[], key: string) => {
  console.log(key, urls.indexOf(key) > -1);

  return urls.indexOf(key) > -1;
};

export const getHideHeader = (url: string) => {
  return getHidePath(
    [
      '/',
      '/star',
      '/star/upgrade',
      '/star/grow',
      '/star/embattle',
      '/star/embattle-test',
      '/star/search',
      '/upgrade-list',
    ],
    url,
  );
};
