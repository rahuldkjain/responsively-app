import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import log from 'electron-log';
import {makeStyles} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import Routes from '../Routes';
import ErrorBoundary from '../components/ErrorBoundary';
import useCreateTheme from '../components/useCreateTheme';
import {
  registerShortcut,
  clearAllShortcuts,
  unregisterShortcut,
} from '../shortcut-manager/renderer-shortcut-manager';
import {
  onZoomChange,
  triggerScrollUp,
  triggerScrollDown,
  screenshotAllDevices,
  flipOrientationAllDevices,
  toggleInspector,
  goToHomepage,
  triggerNavigationBack,
  triggerNavigationForward,
  deleteCookies,
  deleteStorage,
} from '../actions/browser';
import {toggleBookmarkUrl} from '../actions/bookmarks';

function App({history}) {
  const theme = useCreateTheme();

  return (
    <ThemeProvider theme={theme}>
      {process.env.NODE_ENV !== 'development' ? (
        <ErrorBoundary>
          <ConnectedRouter history={history}>
            <Routes />
          </ConnectedRouter>
        </ErrorBoundary>
      ) : (
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      )}
    </ThemeProvider>
  );
}

export default class Root extends Component {
  componentDidMount() {
    this.registerAllShortcuts();
  }

  componentWillUnmount() {
    clearAllShortcuts();
    document.removeEventListener('wheel', this.onWheel);
  }

  registerAllShortcuts = () => {
    const {store} = this.props;
    document.addEventListener('wheel', this.onWheel);

    registerShortcut(
      {
        id: 'ZoomIn',
        title: 'Zoom In',
        accelerators: ['mod+=', 'mod++', 'mod+shift+='],
      },
      () => {
        store.dispatch(onZoomChange(store.getState().browser.zoomLevel + 0.1));
      },
      true
    );

    registerShortcut(
      {id: 'ZoomOut', title: 'Zoom Out', accelerators: ['mod+-']},
      () => {
        store.dispatch(onZoomChange(store.getState().browser.zoomLevel - 0.1));
      },
      true
    );

    registerShortcut(
      {id: 'ZoomReset', title: 'Zoom Reset', accelerators: ['mod+0']},
      () => {
        store.dispatch(onZoomChange(0.6));
      },
      true
    );

    registerShortcut(
      {id: 'EditUrl', title: 'Edit URL', accelerators: ['mod+l']},
      () => {
        document.getElementById('adress').select();
      },
      true
    );

    registerShortcut(
      {id: 'ScroolUp', title: 'Scroll Up', accelerators: ['mod+pageup']},
      () => {
        store.dispatch(triggerScrollUp());
      },
      true
    );

    registerShortcut(
      {id: 'ScroolDown', title: 'Scroll Down', accelerators: ['mod+pagedown']},
      () => {
        store.dispatch(triggerScrollDown());
      },
      true
    );

    registerShortcut(
      {id: 'Screenshot', title: 'Take Screenshot', accelerators: ['mod+prtsc']},
      () => {
        store.dispatch(screenshotAllDevices());
      },
      true,
      'keyup'
    );

    registerShortcut(
      {id: 'TiltDevices', title: 'Tilt Devices', accelerators: ['mod+tab']},
      () => {
        store.dispatch(flipOrientationAllDevices());
      },
      true
    );

    registerShortcut(
      {
        id: 'ToggleInspector',
        title: 'Toggle Inspector',
        accelerators: ['mod+i'],
      },
      () => {
        store.dispatch(toggleInspector());
      },
      true
    );

    registerShortcut(
      {id: 'OpenHome', title: 'Go to Homepage', accelerators: ['alt+home']},
      () => {
        store.dispatch(goToHomepage());
      },
      true
    );

    registerShortcut(
      {id: 'BackAPage', title: 'Back a Page', accelerators: ['alt+left']},
      () => {
        store.dispatch(triggerNavigationBack());
      },
      true
    );

    registerShortcut(
      {
        id: 'ForwardAPage',
        title: 'Forward a Page',
        accelerators: ['alt+right'],
      },
      () => {
        store.dispatch(triggerNavigationForward());
      },
      true
    );

    registerShortcut(
      {id: 'DeleteStorage', title: 'Delete Storage', accelerators: ['mod+del']},
      () => {
        store.dispatch(deleteStorage());
      },
      true
    );

    registerShortcut(
      {
        id: 'DeleteCookies',
        title: 'Delete Cookies',
        accelerators: ['mod+shift+del'],
      },
      () => {
        store.dispatch(deleteCookies());
      },
      true
    );

    registerShortcut(
      {
        id: 'AddBookmark',
        title: 'Add Bookmark',
        accelerators: ['mod+d'],
      },
      () => {
        store.dispatch(toggleBookmarkUrl(store.getState().browser.address));
      },
      true
    );
  };

  onWheel = e => {
    if (e.ctrlKey) {
      const {store} = this.props;
      store.dispatch(
        onZoomChange(
          store.getState().browser.zoomLevel + (e.deltaY < 0 ? 0.1 : -0.1)
        )
      );
    }
  };

  render() {
    const {store, history} = this.props;
    return (
      <Provider store={store}>
        <App history={history} />
      </Provider>
    );
  }
}
