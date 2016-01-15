'use strict';

import React, {
  Component,
  LinkingIOS,
  Navigator,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  WebView,
} from 'react-native';
import qs from 'qs';
import cssVar from 'cssVar';
import Config from './Config';

class SettingsScreen extends Component {
  state = {
    webViewTitle: null,
  };

  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.navBarRightButton = this.navBarRightButton.bind(this);
    this.navBarLeftButton = this.navBarLeftButton.bind(this);
    this.navBarTitle = this.navBarTitle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.handleLogout();
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
    return null;
  }

  navBarTitle(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        Settings [{index}]
      </Text>
    );
  }

  render() {
    return (
      <Navigator
        style={styles.appContainer}
        initialRoute={{ id:'index', index: 0, title: null}}
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
      case 'index':
        return this.renderIndex(nav);
      default:
        return (
          <View>
            <Text>Error Route</Text>
          </View>
        );
    }
  }

  renderIndex(nav) {
    return (
      <ScrollView
        style={styles.scene}
        navigator={nav}>
        <View style={styles.row}>
          <TouchableHighlight
            style={styles.wrapper}
            onPress={() => console.log('Settings A')}>
            <View style={styles.blockButton}>
              <Text style={styles.blockButtonText}>Settings A</Text>
            </View>
          </TouchableHighlight>
          <View style={styles.separator} />
          <TouchableHighlight
            style={styles.wrapper}
            onPress={() => console.log('Settings B')}>
            <View style={styles.blockButton}>
              <Text style={styles.blockButtonText}>Settings B</Text>
            </View>
          </TouchableHighlight>
          <View style={styles.separator} />
          <View style={styles.spacer} />
          <TouchableHighlight
            style={styles.wrapper}
            onPress={this.handleLogout}>
            <View style={styles.blockButton}>
              <Text style={[styles.blockButtonText, styles.LogoutText]}>Log Out</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  spacer: {
    height: 40,
  },
  blockButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    height: 40,
  },
  blockButtonText: {
    fontSize: 16,
  },
  LogoutText: {
    color: 'red',
  },
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
    backgroundColor: '#e9eaed',
  },
});

export default SettingsScreen;
