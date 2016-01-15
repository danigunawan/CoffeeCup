'use strict';

import React, {
  AsyncStorage,
} from 'react-native';
import Config from './Config';

const AUTHORIZE_URL = `${Config().domain}/oauth/authorize`;
const TOKEN_URL = `${Config().domain}/oauth/token`;
const LOGOUT_URL =  `${Config().domain}${Config().logout_path}`;
const CLIENT_ID = Config().oauth.client_id;
const CLIENT_SECRET = Config().oauth.secret;
const REDIRECT_URL = "urn:ietf:wg:oauth:2.0:oob";
const CODE_REGEXP = new RegExp(`^${AUTHORIZE_URL}/(.+)`);
const TOKENS_STORAGE_KEY = '@OAuthClient:tokens';
const REFRESH_GRACE_PERIOD = 1 * 60 * 1000; // 1 minute

class OAuthClient {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
  }

  getAccessToken() {
    return this.hasTokens() && this.accessToken;
  }

  async logout() {
    try {
      await AsyncStorage.removeItem(TOKENS_STORAGE_KEY);
      this.accessToken = this.refreshToken = this.expiresAt = null;
      console.log('Tokens removed.');
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
      throw error;
    }
  }

  async initialize() {
    try {
      var value = await AsyncStorage.getItem(TOKENS_STORAGE_KEY);
      if (value !== null){
        this._setTokens(JSON.parse(value));
        console.log('Previous tokens loaded');
      } else {
        console.log('No previous tokens.')
      }
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
      throw error;
    }
  }

  hasTokens() {
    return this.accessToken && this.expiresAt && this.expiresAt > (new Date);
  }

  _setTokens(tokens) {
    let expiresAt = tokens['expires_at'] || ((new Date).getTime() + tokens['expires_in'] * 1000);
    this.accessToken = tokens['access_token'];
    this.refreshToken = tokens['refresh_token'];
    this.expiresAt = new Date(expiresAt);
    console.log('Set accessToken = ' + this.accessToken);
    if (this.hasTokens()) {
      setTimeout(this._refreshToken.bind(this), this.expiresAt - (new Date) - REFRESH_GRACE_PERIOD);
      return true;
    } else {
      return false;
    }
  }

  async _saveTokens() {
    let value = JSON.stringify({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      expires_at: this.expiresAt,
    });
    try {
      await AsyncStorage.setItem(TOKENS_STORAGE_KEY, value);
      console.log('Saved tokens to disk');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  logoutURL() {
    return LOGOUT_URL;
  }

  authorizeURL() {
    return `${AUTHORIZE_URL}?` +
      `&client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
      '&response_type=code';
  }

  codeFromURL(url) {
    let authCode = CODE_REGEXP.exec(url);
    if (authCode) {
      return authCode[1];
    }
  }

  async _fetchAccessTokenFromCode(code) {
    console.log("Fetching access token with code...")
    try {
      let response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URL,
        })
      });
      return await response.json();
    } catch (error) {
      console.warn(error);
    }
  }

  async accessTokenFromCode(code) {
    let resp = await this._fetchAccessTokenFromCode(code);
    if (this._setTokens(resp)) {
      await this._saveTokens();
    }
  }

  async _fetchAccessTokenFromRefreshToken(code) {
    console.log(`Fetching access token with refresh token ${this.refreshToken}`);
    try {
      let response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
          redirect_uri: REDIRECT_URL,
        })
      });
      return await response.json();
    } catch (error) {
      console.warn(error);
    }
  }

  async _refreshToken() {
    let resp = await this._fetchAccessTokenFromRefreshToken();
    if (this._setTokens(resp)) {
      await this._saveTokens();
    }
  }

  accessTokenFromCode1(code) {
    fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URL,
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((accessTokenResponse) => {
      if (accessTokenResponse.access_token) {
        this._save(accessTokenResponse);
      }
      console.log(accessTokenResponse);
    })
    .catch((error) => {
      console.warn(error);
    });

  }

  _saveAccessTokenResponse(accessTokenResponse) {
    console.log(accessTokenResponse);
  }
}

export default OAuthClient;
