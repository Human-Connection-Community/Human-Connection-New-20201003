// this file is duplicated in `backend/src/config/links.js` and `webapp/constants/links.js` and replaced on rebranding by https://github.com/Ocelot-Social-Community/Ocelot-Social-Deploy-Rebranding/tree/master/branding/constants/
export default {
  LANDING_PAGE: '/login', // examples: '/login', '/registration', '/organization', or external 'https://ocelot.social'

  // you can find and store templates at https://github.com/Ocelot-Social-Community/Ocelot-Social-Deploy-Rebranding/tree/master/branding/templates/

  SUPPORT: 'https://ocelot.social', // example for internal support page: 'https://staging.ocelot.social/support'. set a full URL please, because it is used in e-mails as well!

  // on null or empty strings internal pages are used, see 'webapp/locales/html/'
  ORGANIZATION: 'https://ocelot.social',
  DONATE: 'https://ocelot-social.herokuapp.com/donations', // we use 'ocelot-social.herokuapp.com' at the moment, because redirections of 'ocelot.social' subpages are not working correctly
  IMPRINT: 'https://ocelot-social.herokuapp.com/imprint', // we use 'ocelot-social.herokuapp.com' at the moment, because redirections of 'ocelot.social' subpages are not working correctly
  TERMS_AND_CONDITIONS: null,
  CODE_OF_CONDUCT: null,
  DATA_PRIVACY: null,
  FAQ: 'https://ocelot.social',
}
