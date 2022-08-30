const isApp2 =
  process.env.REACT_APP_API_HOST?.includes('tsapi2') ||
  process.env.REACT_APP_API_HOST?.includes('192');
// const isApp2 = process.env.REACT_APP_API_HOST?.includes('tsapi2');

export default isApp2;
