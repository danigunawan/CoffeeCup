'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';
import OAuthClient from './OAuthClient';

const WEBVIEW_REF = "logout_webview";

class LogoutScreen extends Component {
  state = {
    loading: true,
  };

  constructor(props) {
    super(props);
    this.oauthClient = props.oauthClient;
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  _webViewURL() {
    return this.oauthClient.authorizeURL();
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={true}
          style={styles.webView}
          url={this.oauthClient.logoutURL()}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }

  onNavigationStateChange(navState) {
    if (navState.url && navState.loading == false) {
      this.oauthClient.logout()
      .then(this.props.onLoggedout);
    }
    this.setState({
      loading: navState.loading,
    });
  }
}

var styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  webView: {
    height: 0,
  },
});

export default LogoutScreen;
