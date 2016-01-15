'use strict';

import React, {
  Component,
  LinkingIOS,
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
} from 'react-native';
import qs from 'qs';
import cssVar from 'cssVar';
import Config from './Config';
import ModalWebView from './ModalWebView';

const WEBVIEW_REF = "home_webview";

class HomeScreen extends Component {
  state = {
    webViewTitle: null,
  };

  constructor(props) {
    super(props);
    this._dismissModal = this._dismissModal.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.onNewAction = this.onNewAction.bind(this);
    this.navBarRightButton = this.navBarRightButton.bind(this);
    this.navBarLeftButton = this.navBarLeftButton.bind(this);
    this.navBarTitle = this.navBarTitle.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  _dismissModal() {
    this.setState({modalWebViewURL: null});
  }

  homeURL() {
    return `${Config().domain}/${Config().oauth_login_path}?access_token=${this.props.oauthClient.getAccessToken()}`;
  }

  onNewAction() {
    console.log("New Action");
  }

  navBarLeftButton(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    let previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  }

  navBarRightButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity
        // onPress={() => navigator.push(newRandomRoute())}
        onPress={this.onNewAction}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          New Action
        </Text>
      </TouchableOpacity>
    );
  }

  navBarTitle(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title || this.state.webViewTitle} [{index}]
      </Text>
    );
  }

  onNavigationStateChange(navState) {
    this.setState({webViewTitle: navState.title});
  }

  render() {
    return (
      <Navigator
        style={styles.appContainer}
        initialRoute={{ id:'main', index: 0, title: null}}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: this.navBarLeftButton,
              RightButton: this.navBarRightButton,
              Title: this.navBarTitle,
            }}
            style={styles.navBar}
          />
        }
      />
    );
  }

  renderScene(route, nav) {
    switch (route.id) {
      case 'main':
        return this.renderMain(nav);
      default:
        return (
          <View>
            <Text>Error Route</Text>
          </View>
        );
    }
  }

  renderMain(nav) {
    return (
      <View
        style={styles.scene}
        navigator={nav}>
        <ModalWebView
          handleDismiss={this._dismissModal}
          url={this.state.modalWebViewURL}/>
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={true}
          style={styles.webView}
          url={this.homeURL()}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  appContainer: {
    overflow: 'hidden',
    backgroundColor: '#dddddd',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#F8F8F8',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: cssVar('fbui-bluegray-60'),
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: cssVar('fbui-accent-blue'),
  },
  scene: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#EAEAEA',
  },
});

export default HomeScreen;
