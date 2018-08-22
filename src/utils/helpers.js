const helpers = {};
module.exports = helpers;

helpers.minimizePermissions = function (permissions) {
  if (permissions == null) {
    return null;
  }
  const minimizedPermissions = permissions.map((p) => {
    return p.streamId + '(' + capitalize(p.level) + ')';
  });
  function capitalize (text) {
    return text.charAt(0).toUpperCase();
  }
  return minimizedPermissions.join(',');
};

helpers.minimizeText = function (params: {
  text: string,
  length?: number,
  endChar?: string,
}): ?string {
  const DEFAULT_LENGTH = 50;

  if (params.text == null) {
    return null;
  }
  if (params.length == null) {
    params.length = DEFAULT_LENGTH;
  }

  if (params.text.length < DEFAULT_LENGTH) {
    return [params.text, false];
  }

  let end;
  if (params.endChar != null) {
    end = params.text.indexOf(params.endChar, params.length);
  } else {
    end = params.length;
  }
  return [params.text.substring(0, end) + '...', true];
};
