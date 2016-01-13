'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';
import Config from './Config';

const WEBVIEW_REF = "home_webview";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  homeURL() {
    return `${Config().domain}?access_token=${this.props.oauthClient.getAccessToken()}`;
  }

  injectJavaScript() {
    return 'alert("Hey");'
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={true}
          style={styles.webView}
          url={this.homeURL()}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          injectedJavaScript={this.injectJavaScript()}
        />
      </View>
    );
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

export default HomeScreen;
