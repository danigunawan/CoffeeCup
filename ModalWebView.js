'use strict';

import React, {
  TouchableHighlight,
  Component,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  WebView,
  View,
} from 'react-native';
import cssVar from 'cssVar';

let WEBVIEW_REF = 'webview';
let HEADER = '#F8F8F8';
let BGWASH = 'rgba(255,255,255,0.8)';
let DISABLED_WASH = 'rgba(255,255,255,0.25)';

class ModalWebView extends Component {
  state = {
    status: 'No Page Loaded',
    backButtonEnabled: false,
    forwardButtonEnabled: false,
    loading: true,
    scalesPageToFit: true,
  };

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.reload = this.reload.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
  }

  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  }

  reload() {
    this.refs[WEBVIEW_REF].reload();
  }

  onShouldStartLoadWithRequest(event) {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  }

  onNavigationStateChange(navState) {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  }

  render() {
    return (
      <Modal
        animated={true}
        transparent={false}
        visible={!!this.props.url}>
        <View style={[styles.container]}>
        <View style={[styles.addressBarRow]}>
          <View style={styles.leftButtons}>
            <TouchableOpacity
              onPress={this.goBack}
              style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
              <Text>
                 {'<'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.goForward}
              style={this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton}>
              <Text>
                {'>'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtons}>
            <TouchableOpacity
              onPress={this.props.handleDismiss}>
              <Text style={[styles.navBarButtonText]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <WebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          url={this.props.url}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState={true}
          scalesPageToFit={this.state.scalesPageToFit}
        />
        <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>{this.state.status}</Text>
        </View>
      </View>
      </Modal>
    );
  }
}

var styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // justifyContent: 'center',
  //   // padding: 20,
  // },
  // innerContainer: {
  //   borderRadius: 10,
  //   alignItems: 'center',
  // },
  // navBar: {
  //   backgroundColor: 'white',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   height: 50,
  //   paddingTop: 20,
  //   alignItems: 'center',
  // },
  // navBarText: {
  //   flex: 1,
  //   fontSize: 20,
  //   marginVertical: 10,
  //   fontWeight: 'bold',
  // },
  // navBarTitleText: {
  //   color: cssVar('fbui-bluegray-60'),
  //   fontWeight: '500',
  //   marginVertical: 9,
  // },
  // navBarLeftButton: {
  //   flex: 1,
  //   paddingLeft: 10,
  // },
  // navBarRightButton: {
  //   flex: 1,
  //   paddingRight: 10,
  // },
  // navBarButtonText: {
  //   color: cssVar('fbui-accent-blue'),
  // },

  // modalButton: {
  //   marginTop: 10,
  // },
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: HEADER,
  },
  addressBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  webView: {
    backgroundColor: BGWASH,
    height: 350,
  },
  addressBarTextInput: {
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
  },
  leftButtons: {
    flexDirection: 'row',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  navButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  disabledButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  goButton: {
    height: 24,
    padding: 3,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  navBarButtonText: {
    fontSize: 16,
    color: cssVar('fbui-accent-blue'),
    alignItems: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  statusBarText: {
    color: 'white',
    fontSize: 13,
  },
  spinner: {
    width: 20,
    marginRight: 6,
  },
});

export default ModalWebView;
