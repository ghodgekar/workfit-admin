import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const WatchVideo: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>WatchVideo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1>WatchVideo heree</h1>
      </IonContent>
    </IonPage>
  );
};

export default WatchVideo;
