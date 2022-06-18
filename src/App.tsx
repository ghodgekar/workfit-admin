import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { addCircleOutline, calendarNumberOutline, playSkipBackCircleOutline, peopleSharp, searchSharp } from "ionicons/icons";
import { IonReactRouter } from '@ionic/react-router';
import Landing from './pages/Landing';
import Register from './pages/Register'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Login from './pages/Login';
import Search from "./pages/Search";
import Forum from "./pages/Forum";
import Prescription from "./pages/Prescription";
import Calendar from "./pages/Calendar";
import WatchVideo from './pages/WatchVideo';
import { Storage } from '@capacitor/storage';



setupIonicReact();

const App: React.FC = () => {
  const [isAuthed, setisAuthed] = useState(false)

  useEffect(() => {
    async function fetch() {
      let val = localStorage.getItem("userInfo")
      if (val && JSON.parse(val) && JSON.parse(val) !== {}) {
        setisAuthed(true)
      }
      const { value } = await Storage.get({ key: 'userInfo' });
      if (value && JSON.parse(value) && JSON.parse(value)) {
        setisAuthed(true)
      }
    }
    fetch();
  }, [])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
              <Route
                path="/"
                component={Landing}
                exact />
              <Route
                path="/login"

                exact ><Login setisAuthed={setisAuthed} /></Route>

              <Route
                path="/calendar"
                render={() => { return isAuthed ? <Calendar /> : <Login setisAuthed={setisAuthed} />; }}
                exact />

              <Route
                path="/tutorial"
                render={() => { return isAuthed ? <WatchVideo /> : <Login setisAuthed={setisAuthed} />; }}
                exact />

              <Route
                path="/prescription"
                render={() => { return isAuthed ? <Prescription /> : <Login setisAuthed={setisAuthed} />; }}
                exact />

              <Route
                path="/forum"
                render={() => { return isAuthed ? <Forum /> : <Login setisAuthed={setisAuthed} />; }}
                exact />

              <Route
                path="/search"
                render={() => { return isAuthed ? <Search /> : <Login setisAuthed={setisAuthed} />; }}
                exact />

              <Route
                path="/register"
                component={Register}
                exact />

            </Switch>
          </IonRouterOutlet>
          {/* <Footer/> */}


          <IonTabBar slot="bottom">
            <IonTabButton tab="calendar" href="/calendar">
              <IonIcon icon={calendarNumberOutline} />
            </IonTabButton>

            <IonTabButton tab="watchvideo" href="/tutorial">
              <IonIcon icon={playSkipBackCircleOutline} />
            </IonTabButton>

            <IonTabButton tab="prescription" href="/prescription">
              <IonIcon icon={addCircleOutline} />
            </IonTabButton>

            <IonTabButton tab="forum" href="/forum">
              <IonIcon icon={peopleSharp} />
            </IonTabButton>

            <IonTabButton tab="search" href="/search">
              <IonIcon icon={searchSharp} />
            </IonTabButton>

          </IonTabBar>
        </IonTabs>

      </IonReactRouter>
    </IonApp>
  );
};

export default App;
