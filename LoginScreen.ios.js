'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';
import OAuthClient from './OAuthClient';

const WEBVIEW_REF = "login_webview";

class LoginScreen extends Component {
  state = {
    loading: true,
  };

  constructor(props) {
    super(props);
    this.oauthClient = props.oauthClient;
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={true}
          style={styles.webView}
          url={this.oauthClient.authorizeURL()}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }

  onShouldStartLoadWithRequest(event) {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  }

  onNavigationStateChange(navState) {
    if (navState.url && navState.loading == false) {
      let authCode = this.oauthClient.codeFromURL(navState.url);
      if (authCode) {
        this.oauthClient.accessTokenFromCode(authCode).then(this.props.onAccessTokenFetched);
      }
    }
    this.setState({
      loading: navState.loading,
    });
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default LoginScreen;
