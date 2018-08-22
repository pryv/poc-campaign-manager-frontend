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
