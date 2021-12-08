import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase(
  { name: 'logbook.db', location: 'default' },
  () => {
    console.log('Initialized database');
  },
  error => {
    console.log('Initializing db failed.');
    console.log(error);
  }
);

export const init = drop => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      drop ? tx.executeSql('DROP TABLE entries') : null;
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY NOT NULL, logBook_id INTEGER NOT NULL , recordType TEXT NOT NULL, title TEXT, date INTEGER, description TEXT, imageUri TEXT, address TEXT, lat REAL, lng REAL);',
        [],
        () => {
          resolve();
        }, //if succeed
        (_, err) => {
          console.log('db init error', err);
        } // if fail
      );
    });
  });
  return promise;
};

export const insertEntry = (
  logBookId,
  recordType,
  title,
  date,
  description,
  imageUri,
  address,
  lat,
  lng
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        ' INSERT INTO entries (logBook_id, recordType, title, date, description, imageUri, address, lat, lng) VALUES (?,?,?,?,?,?,?,?,?);',
        [
          logBookId,
          recordType,
          title,
          date,
          description,
          imageUri,
          address,
          lat,
          lng,
        ],
        //if succeed
        (_, result) => {
          resolve(result);
        },
        // if fail
        (_, err) => {
          console.log('db insertion error', err);
        }
      );
    });
  });
  return promise;
};

export const fetchEntries = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM entries',
        [],
        //if succeed
        (_, result) => {
          resolve(result);
        },
        // if fail
        (_, err) => {
          console.log('error fetching from db', err);
        }
      );
    });
  });
  return promise;
};

export const removeEntry = id => {
  new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql(
        ' DELETE FROM entries WHERE id=?;',
        [id],
        //if succeed
        (_, result) => {
          resolve(result);
        },
        // if fail
        (_, err) => {
          console.log('Error deleting from db', err);
        }
      );
    });
  });
};
