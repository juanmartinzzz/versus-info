const getUrlParts = ({url}) => {
  const urlParts = url.split('/');
  return {
    protocol: urlParts[0],
    host: urlParts[2],
    path: urlParts.slice(3).join('/'),
  }
}

const string = {
  getUrlParts,
}

export default string;