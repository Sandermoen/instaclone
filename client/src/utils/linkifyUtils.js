export const linkifyOptions = {
  formatHref: function (href, type) {
    if (type === 'hashtag') {
      href = '/explore/tags/' + href.substring(1);
    }
    if (type === 'mention') {
      href = '/' + href.substring(1);
    }
    return href;
  },
  className: 'styled-link',
  attributes: {
    target: {
      url: '_blank',
    },
  },
};
