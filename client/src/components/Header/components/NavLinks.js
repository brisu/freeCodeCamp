import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { setTheme } from '../../../redux/night-mode-saga';
import { Link, SkeletonSprite } from '../../helpers';
import { updateUserFlag } from '../../../redux/settings';
import {
  forumLocation,
  radioLocation,
  newsLocation,
  homeLocation,
  chineseHome
} from '../../../../../config/env.json';

const {
  availableLangs,
  i18nextCodes,
  langDisplayNames
} = require('../../../../i18n/allLangs');

const locales = availableLangs.client;

const propTypes = {
  displayMenu: PropTypes.bool,
  fetchState: PropTypes.shape({ pending: PropTypes.bool }),
  i18n: PropTypes.object,
  t: PropTypes.func,
  toggleNightMode: PropTypes.func.isRequired,
  user: PropTypes.object
};

const mapDispatchToProps = {
  toggleNightMode: theme => updateUserFlag({ theme })
};

class NavLinks extends Component {
  goToLanguage(lang) {
    const path = window.location.pathname;
    switch (lang) {
      case 'espanol':
        return `${homeLocation}/espanol${path}`;
      case 'english':
        return `${homeLocation}${path}`;
      case '中文':
        return chineseHome;
      default:
        return `${homeLocation}`;
    }
  }

  // toggleTheme(currentTheme = 'default', isSignedIn, toggleNightMode) {
  toggleTheme() {
    console.log('attempting to toggle night mode');
    setTheme('default', 'night');
    // toggleNightMode(currentTheme === 'night' ? 'default' : 'night');
  }

  render() {
    const {
      displayMenu,
      fetchState,
      i18n,
      t,
      toggleNightMode,
      user: { isUserDonating = false, isSignedIn = false, username }
    } = this.props;

    const { pending } = fetchState;

    return pending ? (
      <div className='nav-skeleton'>
        <SkeletonSprite />
      </div>
    ) : (
      <div className='main-nav-group'>
        <ul className={'nav-list' + (displayMenu ? ' display-menu' : '')}>
          <li>
            {isUserDonating ? (
              <span className='nav-link'>{t('donate.thanks')}</span>
            ) : (
              <Link
                className='nav-link'
                external={true}
                sameTab={false}
                to='/donate'
              >
                {t('buttons.donate')}
              </Link>
            )}
          </li>
          <li>
            <Link
              className='nav-link'
              external={true}
              sameTab={true}
              to={forumLocation}
            >
              {t('buttons.forum')}
            </Link>
          </li>
          <li>
            <Link
              className='nav-link'
              external={true}
              sameTab={false}
              to={newsLocation}
            >
              {t('buttons.news')}
            </Link>
          </li>
          <li>
            <Link className='nav-link' to='/learn'>
              {t('buttons.curriculum')}
            </Link>
          </li>
          {username && (
            <li>
              <Link className='nav-link' to={`/${username}`}>
                {t('buttons.profile')}
              </Link>
            </li>
          )}
          <li>
            <Link
              className='nav-link'
              external={true}
              sameTab={false}
              to={radioLocation}
            >
              {t('buttons.radio')}
            </Link>
          </li>
          <li>
            <button
              className='nav-link'
              onClick={() =>
                this.toggleTheme('default', isSignedIn, toggleNightMode)
              }
            >
              {t('settings.labels.night-mode')}
            </button>
          </li>
          <li>
            <span className='nav-link'>{t('footer.language')}</span>
          </li>
          {locales.map(lang => (
            <li>
              <Link className='nav-link sub-link' to={this.goToLanguage(lang)}>
                {langDisplayNames[lang]}
                {i18n.language === i18nextCodes[lang] ? ' ✓' : ''}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

NavLinks.propTypes = propTypes;
NavLinks.displayName = 'NavLinks';

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(NavLinks));
