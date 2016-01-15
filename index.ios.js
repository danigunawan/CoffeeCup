/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {
  AppRegistry,
  Component,
  LinkingIOS,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} from 'react-native';
import qs from 'qs';

import LoginScreen from './LoginScreen';
import LogoutScreen from './LogoutScreen';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import ModalWebView from './ModalWebView';
import OAuthClient from './OAuthClient';

const BASE64_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';
const HOMESCREEN_REF = 'home'
const SETTINGSSCREEN_REF = 'settings'
const LOGINSCREEN_REF = 'login'

class CoffeeCup extends Component {
  state = {selectedTab: 'homeTab', notifCount: 0, presses: 0, screen: 'loading'};

  constructor(props) {
    super(props);
    this.oauthClient = new OAuthClient();
    this.onAccessTokenFetched = this.onAccessTokenFetched.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this._handleOpenURL = this._handleOpenURL.bind(this);
    this.onLoggedout = this.onLoggedout.bind(this);
  }

  componentDidMount() {
    this._loadInitialState().done();
    let url = LinkingIOS.popInitialURL();
    console.log("popInitialURL", url)
    LinkingIOS.addEventListener('url', this._handleOpenURL);
  }

  componentWillUnmount() {
    LinkingIOS.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL(event) {
    console.log(event.url);
    let url = event.url.replace('coffeecup://', '').split('?');
    let path = url[0];
    let params = url[1] ? qs.parse(url[1]) : null;
    this.refs[HOMESCREEN_REF].setState({modalWebViewURL: params.href});
  }

  _renderContent(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  }

  async _loadInitialState() {
    try {
      await Promise.all([
        this.oauthClient.initialize(),
      ]);
      let screen = this.oauthClient.hasTokens() ? 'main' : 'login';
      this.setState({screen: screen});
    } catch (err) {
      console.warn('Error in loading initial state: ', err);
    }
  }

  onAccessTokenFetched() {
    this.setState({screen: 'main'});
  }

  handleLogout() {
    this.setState({'screen': 'logout'});
  }

  onLoggedout() {
    this.setState({selectedTab: 'homeTab', screen: 'login'});
  }

  render() {
    switch(this.state.screen) {
      case 'loading':
        return (
          <View>
            <Text>Loading...</Text>
          </View>
        );
      case 'login':
        return this.renderLogin();
        break;
      case 'logout':
        return this.renderLogout();
        break;
      case 'main':
        return this.renderMain();
        break;
    }

  }

  renderLogin() {
    return (
      <LoginScreen ref={LOGINSCREEN_REF} oauthClient={this.oauthClient} onAccessTokenFetched={this.onAccessTokenFetched}/>
    );
  }

  renderLogout() {
    return (
      <LogoutScreen oauthClient={this.oauthClient} onLoggedout={this.onLoggedout} />
    );
  }

  renderMain() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          title="Home Tab"
          icon={{uri: BASE64_ICON, scale: 3}}
          selected={this.state.selectedTab === 'homeTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'homeTab',
            });
          }}>
          <HomeScreen oauthClient={this.oauthClient} ref={HOMESCREEN_REF} login={this.state.login} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="history"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'redTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'redTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          {this._renderContent('#783E33', 'Red Tab', this.state.notifCount)}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={{uri: BASE64_ICON, scale: 3}}
          title="Settings"
          selected={this.state.selectedTab === 'settings'}
          onPress={() => {
            this.setState({
              selectedTab: 'settings',
              presses: this.state.presses + 1
            });
          }}>
          <SettingsScreen handleLogout={this.handleLogout} ref={SETTINGSSCREEN_REF} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

AppRegistry.registerComponent('CoffeeCup', () => CoffeeCup);
