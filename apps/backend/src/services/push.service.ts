import admin from 'firebase-admin';

let initialized = false;

function initializeFirebase() {
  if (initialized) return;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    initialized = true;
  }
}

export async function sendHotItemNotification(tokens: string[], title: string, body: string) {
  if (!tokens.length) return;
  initializeFirebase();

  if (!initialized) {
    console.info('Skipping push notifications: Firebase not configured');
    return;
  }

  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data: { type: 'HOT_ITEM_ALERT' },
  });
}
